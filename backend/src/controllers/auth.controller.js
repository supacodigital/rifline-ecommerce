// Contrôleur Auth — délègue toute la logique au service
const service = require('../services/auth.service');

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
};

async function register(req, res, next) {
  try {
    const { email, password, first_name, last_name } = req.body;
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }
    const { user, accessToken, refreshToken } = await service.register({ email, password, first_name, last_name });
    res.cookie('access_token',  accessToken,  { ...COOKIE_OPTS, maxAge: 15 * 60 * 1000 });
    res.cookie('refresh_token', refreshToken, COOKIE_OPTS);
    res.status(201).json({ user });
  } catch (err) { next(err); }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }
    const { user, accessToken, refreshToken } = await service.login({ email, password });

    res.cookie('access_token',   accessToken,  { ...COOKIE_OPTS, maxAge: 15 * 60 * 1000 });
    res.cookie('refresh_token',  refreshToken, COOKIE_OPTS);
    res.json({ user });
  } catch (err) { next(err); }
}

async function refresh(req, res, next) {
  try {
    const rawRefreshToken = req.cookies?.refresh_token;
    const { accessToken, refreshToken } = await service.refresh(rawRefreshToken);

    res.cookie('access_token',  accessToken,  { ...COOKIE_OPTS, maxAge: 15 * 60 * 1000 });
    res.cookie('refresh_token', refreshToken, COOKIE_OPTS);
    res.json({ ok: true });
  } catch (err) { next(err); }
}

async function logout(req, res, next) {
  try {
    const rawRefreshToken = req.cookies?.refresh_token;
    await service.logout(rawRefreshToken);
    res.clearCookie('access_token',  { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
    res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
    res.json({ ok: true });
  } catch (err) { next(err); }
}

async function me(req, res, next) {
  try {
    const user = await service.getMe(req.user.id);
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });
    res.json({ user });
  } catch (err) { next(err); }
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email requis' });
    await service.forgotPassword(email);
    // Réponse générique pour ne pas révéler si l'email existe
    res.json({ ok: true });
  } catch (err) { next(err); }
}

async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: 'Token et mot de passe requis' });
    await service.resetPassword(token, password);
    res.json({ ok: true });
  } catch (err) { next(err); }
}

module.exports = { register, login, refresh, logout, me, forgotPassword, resetPassword };
