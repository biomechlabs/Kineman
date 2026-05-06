let jumpClickMode = 0;

const btnJumpTakeoff = document.getElementById('btnJumpTakeoff');
const btnJumpLanding = document.getElementById('btnJumpLanding');

btnJumpTakeoff.addEventListener('click', function() {
    jumpClickMode = 1;
    btnJumpTakeoff.textContent = "👉 Kalkış Anına Tıklayın";
    btnJumpTakeoff.style.backgroundColor = "#e67e22";
});

btnJumpLanding.addEventListener('click', function() {
    jumpClickMode = 2;
    btnJumpLanding.textContent = "👉 İniş Anına Tıklayın";
    btnJumpLanding.style.backgroundColor = "#e67e22";
});

document.getElementById('btnResetJump').addEventListener('click', function() {
    document.getElementById('jump_t_takeoff').textContent = '-';
    document.getElementById('jump_t_landing').textContent = '-';
    jumpClickMode = 0;
    btnJumpTakeoff.textContent = "🚀 Kalkış Anını İşaretle";
    btnJumpTakeoff.style.backgroundColor = "#c0392b";
    btnJumpLanding.textContent = "🛬 İniş Anını İşaretle";
    btnJumpLanding.style.backgroundColor = "#d35400";
    window.clearDots();
});

document.addEventListener('videoTiklandi', function(event) {
    if (!document.getElementById('module-jump').classList.contains('active')) return;
    const time = event.detail.zaman;

    if (jumpClickMode === 1) {
        document.getElementById('jump_t_takeoff').textContent = time;
        jumpClickMode = 0;
        btnJumpTakeoff.textContent = "✅ Kalkış Alındı";
        btnJumpTakeoff.style.backgroundColor = "#27ae60";
    } else if (jumpClickMode === 2) {
        document.getElementById('jump_t_landing').textContent = time;
        jumpClickMode = 0;
        btnJumpLanding.textContent = "✅ İniş Alındı";
        btnJumpLanding.style.backgroundColor = "#27ae60";
    }
});