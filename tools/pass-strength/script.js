document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const strengthFill = document.getElementById('strength-fill');
    const strengthText = document.getElementById('strength-text');

    passwordInput.addEventListener('input', () => {
      const password = passwordInput.value;
      const strength = calculateStrength(password);

      strengthFill.style.width = strength.percent + '%';
      strengthFill.style.backgroundColor = strength.color;
      strengthText.textContent = `Strength: ${strength.text}`;
    });

    function calculateStrength(password) {
      let score = 0;

      if (password.length >= 6) score += 1;
      if (password.length >= 10) score += 1;
      if (/[A-Z]/.test(password)) score += 1;
      if (/[0-9]/.test(password)) score += 1;
      if (/[^A-Za-z0-9]/.test(password)) score += 1;

      switch (score) {
        case 0:
        case 1:
          return { text: 'Very Weak', color: '#ff4b5c', percent: 20 };
        case 2:
          return { text: 'Weak', color: '#ff914d', percent: 40 };
        case 3:
          return { text: 'Moderate', color: '#f3d547', percent: 60 };
        case 4:
          return { text: 'Strong', color: '#3ddc97', percent: 80 };
        case 5:
          return { text: 'Very Strong', color: '#2ecc71', percent: 100 };
        default:
          return { text: '', color: '#ccc', percent: 0 };
      }
    }
});
