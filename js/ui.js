
function showToast() {
    const toast = document.getElementById('toast');
    toast.style.opacity = '1';
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 2000);
}
