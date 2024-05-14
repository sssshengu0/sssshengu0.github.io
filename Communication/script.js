const tabs = document.querySelectorAll('.tab');
const ongoingList = document.querySelector('.ongoing-list');
const completedList = document.querySelector('.completed-list');
const actionBtn = document.getElementById('actionBtn');
const newEventModal = document.getElementById('newEventModal');
const eventContent = document.getElementById('eventContent');
const cancelBtn = document.getElementById('cancelBtn');
const confirmBtn = document.getElementById('confirmBtn');

// 格式化日期
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}年${month}月${day}日`;
}

// 渲染事件列表
function renderEvents() {
  const events = getEventsFromStorage();
  ongoingList.innerHTML = '';
  completedList.innerHTML = '';
  events.forEach((event, index) => {
    const eventElement = document.createElement('div');
    eventElement.classList.add('event');
    eventElement.innerHTML = `
      <div class="event-content">
        <div class="event-date">${formatDate(new Date(event.createdAt))}</div>
        <h3 class="event-title">${event.title}</h3>
        <p>${event.content}</p>
      </div>
      <button class="action-btn ${event.status === 1 ? 'delete-btn' : 'complete-btn'}">
        ${event.status === 1 ? '删除' : '完成'}
      </button>
    `;
    eventElement.querySelector('.action-btn').addEventListener('click', () => {
      if (event.status === 1) {
        handleDeleteEvent(index);
      } else {
        handleCompleteEvent(index);
      }
    });
    if (event.status === 1) {
      completedList.appendChild(eventElement);
    } else {
      ongoingList.appendChild(eventElement);
    }
  });
}

// 切换选项卡
function switchTab(tab) {
  tabs.forEach(tab => tab.classList.remove('active'));
  tab.classList.add('active');
  const tabName = tab.dataset.tab;
  if (tabName === 'ongoing') {
    ongoingList.style.display = 'block';
    completedList.style.display = 'none';
    actionBtn.textContent = '+';
    actionBtn.style.backgroundColor = '#4caf50';
    actionBtn.removeEventListener('click', handleClearCompletedEvents);
    actionBtn.addEventListener('click', showNewEventModal);
  } else if (tabName === 'completed') {
    ongoingList.style.display = 'none';
    completedList.style.display = 'block';
    actionBtn.textContent = '清空';
    actionBtn.style.backgroundColor = '#f44336';
    actionBtn.removeEventListener('click', showNewEventModal);
    actionBtn.addEventListener('click', handleClearCompletedEvents);
  }
}

// 显示添加新事件的模态框
function showNewEventModal() {
  newEventModal.style.display = 'block';
}

// 隐藏添加新事件的模态框
function hideNewEventModal() {
  newEventModal.style.display = 'none';
  eventContent.value = '';
}

// 处理确认添加新事件
function handleConfirmNewEvent() {
  const content = eventContent.value.trim();
  if (content !== '') {
    const lines = content.split('\n');
    const title = lines[0];
    const eventContent = lines.slice(1).join('\n');
    addEvent(title, eventContent);
    hideNewEventModal();
    renderEvents();
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

// 处理清空已完成事件列表
function handleClearCompletedEvents() {
  clearCompletedEvents();
  renderEvents();
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => switchTab(tab));
});

actionBtn.addEventListener('click', showNewEventModal);
cancelBtn.addEventListener('click', hideNewEventModal);
confirmBtn.addEventListener('click', handleConfirmNewEvent);

renderEvents();