let isDragging = false;
let startX;
let currentTranslate = 0;

// 触摸开始事件处理程序
function handleTouchStart(event) {
  isDragging = true;
  startX = event.touches[0].clientX;
}

// 触摸移动事件处理程序
function handleTouchMove(event) {
  if (!isDragging) return;
  const currentX = event.touches[0].clientX;
  const diffX = currentX - startX;
  currentTranslate = Math.max(diffX, -80);
  event.currentTarget.style.transform = `translateX(${currentTranslate}px)`;
}

// 触摸结束事件处理程序
function handleTouchEnd(event) {
  isDragging = false;
  const eventElement = event.currentTarget;
  const actionBtn = eventElement.querySelector('.action-btn');
  
  if (currentTranslate < -40) {
    eventElement.style.transform = 'translateX(-80px)';
    actionBtn.style.right = '0';
  } else {
    eventElement.style.transform = 'translateX(0)';
    actionBtn.style.right = '-80px';
  }
}

// 处理删除事件
function handleDeleteEvent(index) {
  deleteEvent(index);
  renderEvents();
}

// 处理完成事件
function handleCompleteEvent(index) {
  completeEvent(index);
  renderEvents();
}