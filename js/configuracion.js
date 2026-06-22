function showTab(tab, el) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');
    el.classList.add('active');
    return false;
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

function cambiarPassword() {
    const actual = document.getElementById('passActual').value;
    const nueva = document.getElementById('passNueva').value;
    const confirmar = document.getElementById('passConfirmar').value;
    const msg = document.getElementById('passMsg');
    if (!actual || !nueva || !confirmar) {
        msg.textContent = '⚠️ Completa todos los campos';
        msg.className = 'msg-info msg-warning';
        msg.style.display = 'block';
        return;
    }
    if (nueva !== confirmar) {
        msg.textContent = '❌ Las contraseñas no coinciden';
        msg.className = 'msg-info msg-error';
        msg.style.display = 'block';
        return;
    }
    msg.style.display = 'none';
    showToast('✅ Contraseña actualizada');
}

window.addEventListener("DOMContentLoaded", function () {
    const btnSeguridad = document.querySelector('[onclick*="seguridad"]');
    if (btnSeguridad) showTab('seguridad', btnSeguridad);
});