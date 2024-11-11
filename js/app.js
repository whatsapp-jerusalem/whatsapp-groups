let neighborhoods = {};

async function loadNeighborhoods() {
    const SHEET_URL = `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/gviz/tq?tqx=out:json&sheet=${CONFIG.SHEET_NAME}`;

    try {
        const response = await fetch(SHEET_URL);
        const text = await response.text();
        const data = JSON.parse(text.substr(47).slice(0, -2));
        
        data.table.rows.forEach(row => {
            const name = row.c[1].v;  // עמודה B - שם שכונה
            const link = row.c[2].v;  // עמודה C - קישור
            neighborhoods[name] = link;
        });
        
        console.log('Neighborhoods loaded:', Object.keys(neighborhoods).length);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function initSearch() {
    const search = document.getElementById('neighborhood-search');
    const button = document.getElementById('whatsapp-button');
    const whatsappLink = button.querySelector('a');
    
    search.addEventListener('input', function() {
        const value = this.value.trim().toLowerCase();
        const matchedNeighborhood = Object.keys(neighborhoods).find(n => 
            n.toLowerCase().includes(value) && value.length > 1
        );
        
        if (matchedNeighborhood) {
            whatsappLink.href = neighborhoods[matchedNeighborhood];
            whatsappLink.textContent = `הצטרפו לקבוצת ${matchedNeighborhood}`;
            button.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
    });
}

// טעינת הנתונים בעת טעינת הדף
window.addEventListener('load', async () => {
    await loadNeighborhoods();
    initSearch();
});
