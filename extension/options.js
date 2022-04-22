/**
 * Return the checkbox that toggles whether badge requests are sent.
 */
function badgeCheckbox() {
  return /** @type {HTMLInputElement} */ (document.getElementById('netvyneBadge'));
}

function saveOptions() {
  chrome.storage.local.set({ netvyneBadge: badgeCheckbox().checked });
}

function loadOptions() {
  chrome.storage.local.get({ netvyneBadge: true }, (result) => {
    badgeCheckbox().checked = result.netvyneBadge;
  });
}

document.addEventListener('DOMContentLoaded', loadOptions);
badgeCheckbox().addEventListener('click', saveOptions);
