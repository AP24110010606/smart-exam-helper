/**
 * Safe user object for API responses (no password).
 */
function userResponse(user) {
  if (!user) return null;
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl || '',
  };
}

module.exports = { userResponse };
