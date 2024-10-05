const mobileMenuButton = document.getElementById('mobile-menu-button');
const closeMenuButton = document.getElementById('close-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

export function openMenu() {
  mobileMenu.style.display = 'block';
}

export function closeMenu() {
  mobileMenu.style.display = 'none';
}

mobileMenuButton.addEventListener('click', openMenu);
closeMenuButton.addEventListener('click', closeMenu);

mobileMenuButton.addEventListener('click', (event) => {
  if (!mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target)) {
    closeMenu();
  }
});