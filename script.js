const timer = document.getElementById("timer");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const resetButton = document.getElementById("reset");
const notificationMessage = document.getElementById("notification-message");
const buttonTambah1Menit = document.getElementById("tambah1");
const buttonTambah5Menit = document.getElementById("tambah5");
const buttonKurangi1Menit = document.getElementById("kurangi1");
const buttonKurangi5Menit = document.getElementById("kurangi5");
const alarmModal = document.getElementById("alarm-modal");
const closeAlarmButton = document.getElementById("close-alarm-button");
const alarmSound = new Audio("sound/waktuHabis.mp3");
const DEFAULT_FOCUS_TIME = 25;
const ORIGINAL_TITLE = "Zenigma";
let endTime;
let focustime = DEFAULT_FOCUS_TIME;
let timeInSeconds = focustime * 60;
let timerInterval;
let isTimerRunning = false;

function changeTime(amount) {
    if (isTimerRunning) {
        return; // untuk cek kondisi jika timer sedang berjalan
    }

    // fungsinya untuk antisipasi user mengurangi waktu kurang dari 1 menit
    if (focustime <= 1 && amount < 0) {
        alert("Timer minimal adalah 1 menit😑");
        return;
    }

    focustime += amount; // mengubah nilai dari focustime

    // pemberian batasan waktu minimum 1 menit
    if (focustime < 1) {
        focustime = 1;
    }

    timeInSeconds = focustime * 60;
    updateDisplay(timeInSeconds);
}

function updateDisplay(secondsLeft) {
    let formattedTime;
    if (secondsLeft >= 3600) {
        // kondisi jika waktu lebih dari atau sama dengan 1 jam
        const hours = Math.floor(secondsLeft / 3600);
        const minutes = Math.floor((secondsLeft % 3600) / 60);
        const seconds = secondsLeft % 60;
        formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    } else {
        // kondisi jika waktu kurang dari 1 jam
        const minutes = Math.floor(secondsLeft / 60);
        const seconds = secondsLeft % 60;
        formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    timer.textContent = formattedTime;
    if (isTimerRunning) {
        document.title = `${formattedTime} | ${ORIGINAL_TITLE}`;
    } else {
        document.title = ORIGINAL_TITLE;
    }
}

startButton.addEventListener("click", function () {
    if (isTimerRunning) {
        notificationMessage.textContent = "Timer sudah berjalan!";
        notificationMessage.style.display = "block"; // Tampilkan pesan notifikasi
        setTimeout(function () {
            notificationMessage.style.display = "none";
        }, 2000);
    } else if (timeInSeconds <= 0) {
        alert("Kamu belum menambahkan timer😡");
    } else {
        isTimerRunning = true;
        // Setiap kali tombol start diklik, kita mulai intervalnya
        const now = Date.now(); // Waktu saat ini dalam milidetik
        endTime = now + timeInSeconds * 1000; // Hitung waktu selesai dalam milidetik
        timerInterval = setInterval(function () {
            const remainingMiliseconds = endTime - Date.now(); // hitung sisa waktu dalam milidetik
            const remainingSeconds = Math.round(remainingMiliseconds / 1000); // konversi ke detik dan bulatkan
            timeInSeconds = remainingSeconds;
            if (timeInSeconds <= 0) {
                clearInterval(timerInterval);
                isTimerRunning = false;
                alarmSound.loop = true;
                alarmSound.play();
                alarmModal.classList.remove("hidden");
                timeInSeconds = focustime * 60;
                updateDisplay(timeInSeconds);
                return;
            }
            updateDisplay(timeInSeconds);
        }, 1000);
    }
});

closeAlarmButton.addEventListener("click", function () {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    alarmSound.loop = false;
    alarmModal.classList.add("hidden");
});

stopButton.addEventListener("click", function () {
    clearInterval(timerInterval);
    isTimerRunning = false;
});

resetButton.addEventListener("click", function () {
    clearInterval(timerInterval);
    isTimerRunning = false;
    focustime = DEFAULT_FOCUS_TIME;
    timeInSeconds = focustime * 60;
    updateDisplay(timeInSeconds);
});

buttonTambah1Menit.addEventListener("click", function () {
    changeTime(1);
});

buttonTambah5Menit.addEventListener("click", function () {
    changeTime(5);
});

buttonKurangi1Menit.addEventListener("click", function () {
    changeTime(-1);
});

buttonKurangi5Menit.addEventListener("click", function () {
    changeTime(-5);
});

updateDisplay(timeInSeconds);
