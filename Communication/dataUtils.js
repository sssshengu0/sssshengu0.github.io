// 从本地存储获取事件数据
function getEventsFromStorage() {
  return JSON.parse(localStorage.getItem('events')) || [];
}

// 将事件数据保存到本地存储
function saveEventsToStorage(events) {
  localStorage.setItem('events', JSON.stringify(events));
}

// 添加新事件
function addEvent(title, content) {
  const events = getEventsFromStorage();
  events.push({ title, content, status: 0, createdAt: new Date() });
  saveEventsToStorage(events);
}

// 删除事件
function deleteEvent(index) {
  const events = getEventsFromStorage();
  events.splice(index, 1);
  saveEventsToStorage(events);
}

// 完成事件
function completeEvent(index) {
  const events = getEventsFromStorage();
  events[index].status = 1;
  saveEventsToStorage(events);
}

// 清空已完成事件列表
function clearCompletedEvents() {
  const events = getEventsFromStorage();
  const filteredEvents = events.filter(event => event.status === 0);
  saveEventsToStorage(filteredEvents);
}