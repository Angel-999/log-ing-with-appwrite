const defaultLang = 'es'; // Fallback language
const userLang = await localStorage.getItem('userLang') || defaultLang;
loadLanguage();
export async function loadLanguage() {
    const page = getCurrentPage();
    try {
        const lang = userLang || defaultLang;
        const response = await fetch(`../languages/${lang}.json`);
        if (!response.ok) throw new Error(`Could not load ${lang}.json translations`);
        const translations = await response.json();
        const languageSelect = document.getElementById("language-select");
        languageSelect.value = lang;
        // Update text content or placeholder based on the element type
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');

            // Check for global translation first, then page-specific translation
            let translation = translations["Global"] && translations["Global"][key]
                ? translations["Global"][key]
                : null;

            if (translations[page] && translations[page][key]) {
                translation = translations[page][key];
            }

            if (translation) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.setAttribute('placeholder', translation);
                } else {
                    el.innerText = translation;
                }
            }
        });
    } catch (error) {
        console.error(error);
    }
}


export function getCurrentPage() {
    const path = window.location.href;
    const url = path.split('/').pop().split('.').shift();
    if (url == "#" || url == "" || url == "Index") {
        return "Trucks";
    }
    // Example: if URL is /services.html, return 'services'
    return path.split('/').pop().split('.').shift();

}
export { userLang };