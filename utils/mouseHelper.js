const { waiting } = require(".");

// Fungsi untuk menambahkan kursor visual khusus
const addCustomCursor = async (page) => {
  await page.evaluate(() => {
    const cursor = document.createElement("div");
    cursor.id = "custom-cursor";
    cursor.style.width = "15px";
    cursor.style.height = "15px";
    cursor.style.backgroundColor = "blue";
    cursor.style.position = "absolute";
    cursor.style.borderRadius = "50%";
    cursor.style.opacity = "0.7";
    cursor.style.zIndex = "10000";
    cursor.style.pointerEvents = "none"; // Agar kursor tidak mengganggu elemen lain
    cursor.style.transition = "top 0.1s linear, left 0.1s linear"; // Efek transisi
    document.body.appendChild(cursor);

    // Fungsi untuk memperbarui posisi kursor di halaman
    window.updateCursorPosition = (x, y) => {
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
    };
  });
};

const moveCursor = async (page, startX, startY, endX, endY) => {
  const steps = 5;
  const deltaX = (endX - startX) / steps;
  const deltaY = (endY - startY) / steps;

  for (let i = 0; i < steps; i++) {
    startX += deltaX;
    startY += deltaY;

    await page.evaluate(
      (x, y) => {
        window.updateCursorPosition(x, y);
      },
      startX,
      startY
    );

    await waiting(100); // Jeda untuk animasi per langkah
  }

  // Pastikan kursor berakhir di posisi akhir yang tepat
  await page.evaluate(
    (x, y) => {
      window.updateCursorPosition(x, y);
    },
    endX,
    endY
  );
};

const animateMouse = async (page, startX, startY, selector) => {
  const element = await page.$(selector); // Pilih elemen berdasarkan ID
  const box = await element.boundingBox();
  const targetX = box.x + box.width / 2;
  const targetY = box.y + box.height / 2;

  await moveCursor(page, startX, startY, targetX, targetY); // Gerakkan kursor ke posisi kedua
  await page.mouse.move(targetX, targetY);
  // await page.mouse.click(targetX, targetY);
  return { targetX, targetY };
};

module.exports = { addCustomCursor, moveCursor, animateMouse };
