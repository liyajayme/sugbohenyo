function scrollToMunicipality() {
    const selectBox = document.getElementById("municipality-select");
    const targetId = selectBox.value;
    
    if (targetId) {
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
}