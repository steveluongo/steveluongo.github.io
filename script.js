// Foxside Web Development LLC - Game Boy Interface with JSON Content Management

let siteContent = null;
let currentSectionIndex = 0;

document.addEventListener('DOMContentLoaded', function() {
    // Load content from JSON file
    loadContent();
});

async function loadContent() {
    try {
        const response = await fetch('content.json');
        siteContent = await response.json();
        initializeSite();
    } catch (error) {
        console.error('Error loading content:', error);
        // Fallback to default content if JSON fails to load
        siteContent = getDefaultContent();
        initializeSite();
    }
}

function getDefaultContent() {
    return {
        "company": {
            "name": "FOXSIDE",
            "subtitle": "WEB DEVELOPMENT LLC"
        },
        "sections": [
            {
                "id": "about",
                "title": "ABOUT FOXSIDE",
                "menuText": "ABOUT US",
                "content": [
                    {
                        "type": "paragraph",
                        "text": "Content failed to load. Please refresh the page."
                    }
                ]
            }
        ],
        "footer": {
            "text": "© 2024 FOXSIDE WEB DEVELOPMENT LLC"
        }
    };
}

function initializeSite() {
    // Populate company info
    document.getElementById('company-name').textContent = siteContent.company.name;
    document.getElementById('company-subtitle').textContent = siteContent.company.subtitle;
    document.getElementById('footer-text').textContent = siteContent.footer.text;

    // Generate menu
    generateMenu();

    // Generate sections
    generateSections();

    // Initialize controls
    initializeControls();

    // Add startup animation
    addStartupAnimation();

    // Add screen flicker effect
    addScreenFlicker();
}

function generateMenu() {
    const menuContainer = document.getElementById('menu');
    menuContainer.innerHTML = '';

    siteContent.sections.forEach((section, index) => {
        const menuItem = document.createElement('div');
        menuItem.className = `menu-item ${index === 0 ? 'active' : ''}`;
        menuItem.setAttribute('data-section', section.id);
        menuItem.innerHTML = `
            ${section.menuText}
        `;

        menuItem.addEventListener('click', () => {
            navigateToSection(index);
        });

        menuContainer.appendChild(menuItem);
    });
}

function generateSections() {
    const contentContainer = document.getElementById('content');
    contentContainer.innerHTML = '';

    siteContent.sections.forEach((section, index) => {
        const sectionElement = document.createElement('div');
        sectionElement.className = `section ${index === 0 ? 'active' : ''}`;
        sectionElement.id = section.id;

        // Create section title
        const title = document.createElement('h3');
        title.textContent = section.title;
        sectionElement.appendChild(title);

        // Generate content based on type
        section.content.forEach(contentItem => {
            const contentElement = generateContentElement(contentItem);
            sectionElement.appendChild(contentElement);
        });

        contentContainer.appendChild(sectionElement);
    });
}

function generateContentElement(contentItem) {
    switch (contentItem.type) {
        case 'paragraph':
            const p = document.createElement('p');
            p.textContent = contentItem.text;
            return p;

        case 'grid':
            const grid = document.createElement('div');
            grid.className = contentItem.items[0].title.includes('SERVICE') ? 'service-grid' : 'portfolio-grid';

            contentItem.items.forEach(item => {
                const gridItem = document.createElement('div');
                gridItem.className = contentItem.items[0].title.includes('SERVICE') ? 'service-item' : 'portfolio-item';

                const title = document.createElement('h4');
                title.textContent = item.title;

                const description = document.createElement('p');
                description.textContent = item.description;

                gridItem.appendChild(title);
                gridItem.appendChild(description);
                grid.appendChild(gridItem);
            });

            return grid;

                case 'contact-info':
            const contactInfo = document.createElement('div');
            contactInfo.className = 'contact-info';

            contentItem.items.forEach(item => {
                const p = document.createElement('p');
                if (item.label === 'EMAIL') {
                    p.innerHTML = `<strong>${item.label}:</strong> <a href="mailto:${item.value}" class="contact-link">${item.value}</a>`;
                } else {
                    p.innerHTML = `<strong>${item.label}:</strong> ${item.value}`;
                }
                contactInfo.appendChild(p);
            });

            return contactInfo;

        case 'contact-form':
            const contactForm = document.createElement('div');
            contactForm.className = 'contact-form';

            contentItem.text.forEach(text => {
                const p = document.createElement('p');
                p.textContent = text;
                contactForm.appendChild(p);
            });

            return contactForm;

        default:
            const div = document.createElement('div');
            div.textContent = 'Content type not supported';
            return div;
    }
}

function initializeControls() {
    const buttons = document.querySelectorAll('.button');
    const dPad = document.querySelector('.d-pad');

    // Keyboard Controls
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowUp':
                e.preventDefault();
                navigateUp();
                break;
            case 'ArrowDown':
                e.preventDefault();
                navigateDown();
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                selectCurrentItem();
                break;
            case 'a':
            case 'A':
                e.preventDefault();
                triggerAButton();
                break;
            case 'b':
            case 'B':
                e.preventDefault();
                triggerBButton();
                break;
        }
    });

    // D-Pad Click Controls
    dPad.addEventListener('click', (e) => {
        const rect = dPad.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        if (y < centerY - 10) {
            addDpadButtonEffect('up');
            navigateUp();
        } else if (y > centerY + 10) {
            addDpadButtonEffect('down');
            navigateDown();
        } else if (x < centerX - 10) {
            addDpadButtonEffect('left');
            navigateLeft();
        } else if (x > centerX + 10) {
            addDpadButtonEffect('right');
            navigateRight();
        }
    });

    // Button Click Controls
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (button.classList.contains('a-button')) {
                triggerAButton();
            } else if (button.classList.contains('b-button')) {
                triggerBButton();
            }
        });
    });

    // Add hover effects for buttons
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
    });
}

function navigateToSection(index) {
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.section');

    // Remove active class from all menu items and sections
    menuItems.forEach(item => item.classList.remove('active'));
    sections.forEach(section => section.classList.remove('active'));

    // Add active class to selected menu item and section
    menuItems[index].classList.add('active');
    sections[index].classList.add('active');

    currentSectionIndex = index;

    // Add button press effect
    addButtonEffect(menuItems[index]);
}

function navigateUp() {
    if (currentSectionIndex > 0) {
        navigateToSection(currentSectionIndex - 1);
    }
}

function navigateDown() {
    if (currentSectionIndex < siteContent.sections.length - 1) {
        navigateToSection(currentSectionIndex + 1);
    }
}

function navigateLeft() {
    console.log('Left pressed');
}

function navigateRight() {
    console.log('Right pressed');
}

function selectCurrentItem() {
    const menuItems = document.querySelectorAll('.menu-item');
    addButtonEffect(menuItems[currentSectionIndex]);
}

function triggerAButton() {
    const aButton = document.querySelector('.a-button');
    if (aButton) {
        aButton.style.transform = 'scale(0.85)';
        aButton.style.boxShadow = 'inset 0 4px 8px rgba(0,0,0,0.4), 0 1px 2px rgba(255,255,255,0.05)';

        setTimeout(() => {
            aButton.style.transform = 'scale(1)';
            aButton.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.3), 0 2px 4px rgba(255,255,255,0.1)';
        }, 150);
    }
    console.log('A button pressed');
}

function triggerBButton() {
    const bButton = document.querySelector('.b-button');
    if (bButton) {
        bButton.style.transform = 'scale(0.85)';
        bButton.style.boxShadow = 'inset 0 4px 8px rgba(0,0,0,0.4), 0 1px 2px rgba(255,255,255,0.05)';

        setTimeout(() => {
            bButton.style.transform = 'scale(1)';
            bButton.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.3), 0 2px 4px rgba(255,255,255,0.1)';
        }, 150);
    }
    console.log('B button pressed');
}

function addButtonEffect(element) {
    element.style.transform = 'scale(0.95)';
    element.style.transition = 'transform 0.1s ease';

    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 100);
}

function addDpadButtonEffect(direction) {
    const dPadButton = document.querySelector(`.d-pad-${direction}`);
    if (dPadButton) {
        // Add pressed state
        dPadButton.style.transform = direction === 'left' || direction === 'right'
            ? 'translateY(-50%) scale(0.85)'
            : 'translateX(-50%) scale(0.85)';
        dPadButton.style.background = '#4a4a4a';
        dPadButton.style.boxShadow = 'inset 0 4px 8px rgba(0,0,0,0.4), 0 1px 2px rgba(255,255,255,0.05)';

        // Reset after animation
        setTimeout(() => {
            dPadButton.style.transform = direction === 'left' || direction === 'right'
                ? 'translateY(-50%) scale(1)'
                : 'translateX(-50%) scale(1)';
            dPadButton.style.background = '#5a5a5a';
            dPadButton.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.3), 0 2px 4px rgba(255,255,255,0.1)';
        }, 150);
    }
}

function addStartupAnimation() {
    // Hide the main content initially
    const gameboyContainer = document.querySelector('.gameboy-container');
    const screenContent = document.querySelector('.screen-content');

    screenContent.style.display = 'none';
    gameboyContainer.style.opacity = '1';
    gameboyContainer.style.transform = 'scale(1)';

    // Create the startup screen
    const startupScreen = document.createElement('div');
    startupScreen.className = 'startup-screen';
    startupScreen.innerHTML = `
        <div class="startup-logo">
            <div class="logo-text">FOXSIDE</div>
            <div class="logo-subtitle">WEB DEVELOPMENT LLC</div>
        </div>
        <div class="startup-loading">
            <div class="loading-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;

    document.querySelector('.screen').appendChild(startupScreen);

    // Animate logo scrolling down
    const logo = startupScreen.querySelector('.startup-logo');
    logo.style.transform = 'translateY(-100vh)';
    logo.style.transition = 'transform 2s ease-out';

    setTimeout(() => {
        logo.style.transform = 'translateY(0)';
    }, 100);

    // After logo settles, show loading dots
    setTimeout(() => {
        startupScreen.querySelector('.loading-dots').style.opacity = '1';
    }, 2200);

            // After loading animation, transition to main content
    setTimeout(() => {
        startupScreen.style.opacity = '0';
        startupScreen.style.transition = 'opacity 0.5s ease';

        setTimeout(() => {
            startupScreen.remove();
            screenContent.style.display = 'flex';
            screenContent.style.animation = 'fadeIn 0.5s ease';
        }, 500);
    }, 4000);
}

function addScreenFlicker() {
    setInterval(() => {
        if (Math.random() < 0.01) { // 1% chance every interval
            const screen = document.querySelector('.screen');
            screen.style.filter = 'brightness(0.8)';
            setTimeout(() => {
                screen.style.filter = 'brightness(1)';
            }, 50);
        }
    }, 5000);
}


