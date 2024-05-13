let promotion = 0.15;
let presetDiscount = 0;

// 模块1 - 修改和完成按钮功能
const modifyBtns = document.querySelectorAll('.modify-btn');
const completeBtns = document.querySelectorAll('.complete-btn');


// 模块2 - 进度条与数量同步
const sliders = document.querySelectorAll('.slider');
const quantities = document.querySelectorAll('.module-2 table td span');

sliders.forEach((slider, index) => {
  slider.style.backgroundColor = `hsl(${index * 60}, 100%, 50%)`;
  
  slider.addEventListener('input', () => {
    quantities[index].textContent = slider.value;
    slider.style.opacity = 0.35 + (slider.value / 12) * 0.65;
    updateModule3();
    updateRecordButton();
  });
});

// 设置大促参数
const promotionInput = document.getElementById('promotion-input');
const setPromotionBtn = document.getElementById('set-promotion-btn');

setPromotionBtn.addEventListener('click', () => {
  const promotionValue = parseFloat(promotionInput.value) / 100;
  promotion = promotionValue;
});

// 模块3 - 动态生成表格
const module3Table = document.querySelector('.module-3 table');
const recordBtn = document.getElementById('record-btn');
const resetBtn = document.getElementById('reset-btn');
const productCombination = document.querySelector('.product-combination');

function updateModule3() {
  const selectedProducts = [];
  let totalCost = 0;
  let totalWeight = 0;
  let totalScanPrice = 0;
  
  sliders.forEach((slider, index) => {
    const quantity = parseInt(slider.value);
    if (quantity >= 1) {
      const productName = slider.parentNode.previousElementSibling.textContent;
      const costPrice = parseFloat(document.querySelectorAll('.module-1 table td:nth-child(2)')[index].textContent);
      const weight = parseInt(document.querySelectorAll('.module-1 table td:nth-child(3)')[index].textContent);
      const scanPrice = parseFloat(document.querySelectorAll('.module-1 table td:nth-child(4)')[index].textContent);
      
      //selectedProducts.push(`${quantity}${productName}`);
      selectedProducts.push(`${productName}`);
      totalCost += quantity * costPrice;
      totalWeight += quantity * weight;
      totalScanPrice += quantity * scanPrice;
    }
  });
  
  const hasSelectedProducts = selectedProducts.length > 0;
  module3Table.style.border = hasSelectedProducts ? 'none' : '1px solid black';
  
  module3Table.rows[1].cells[0].textContent = hasSelectedProducts ? selectedProducts.join('') : '';
  module3Table.rows[1].cells[1].textContent = hasSelectedProducts ? totalCost.toFixed(2) : '';
  module3Table.rows[1].cells[2].textContent = hasSelectedProducts ? totalWeight : '';
  module3Table.rows[1].cells[3].textContent = hasSelectedProducts ? totalScanPrice.toFixed(2) : '';
}

function updateRecordButton() {
  const hasSelectedProducts = Array.from(sliders).some(slider => slider.value > 0);
  recordBtn.classList.toggle('active', hasSelectedProducts);
  recordBtn.disabled = !hasSelectedProducts;
}
let tableCounter = 0;
// 记录按钮功能
recordBtn.addEventListener('click', () => {
  const table = document.createElement('table');
  table.setAttribute('data-table-id', ++tableCounter);
  
  table.innerHTML = `
  <br>
    <tr>
      <td colspan="3">${module3Table.rows[1].cells[0].textContent}</td>
      <td rowspan="3" class="remove-btn-container">
        <button class="remove-btn" >从列表移除</button><br>
        <button class="save-data-btn">保存数据</button>
      </td>
    </tr>
    <tr>
      <td>配置总成本</td>
      <td>配置总重量</td>
      <td>配置总扫码价</td>
    </tr>
    <tr>
      <td>${module3Table.rows[1].cells[1].textContent}</td>
      <td>${module3Table.rows[1].cells[2].textContent}</td>
      <td>${module3Table.rows[1].cells[3].textContent}</td>
    </tr>
    <tr>
      <td>售价</td>
      <td>对应折扣</td>
      <td>利润</td>
      <td>操作</td>
    </tr>
  `;
  
  productCombination.appendChild(table);

  const removeBtn = table.querySelector('.remove-btn');
  
  removeBtn.addEventListener('click', () => {
    table.remove();
    const addBtn = document.querySelector(`button[data-table-id="${table.getAttribute('data-table-id')}"]`);
    if (addBtn) {
      addBtn.remove();
    }
  });
  
  const saveDataBtn = table.querySelector('.save-data-btn');
  saveDataBtn.addEventListener('click', () => saveData(table));

function saveData(table) {
  const rows = table.querySelectorAll('tr');
  const dataRows = Array.from(rows).slice(4).filter(row => row.cells[0].querySelector('input')?.value);

  if (dataRows.length > 0) {
    const data = `
    <html>
        <head>
          <style>
            table {
              border-collapse: collapse;

            }

            td {
              text-align:center;
              border: 1px solid black;
              padding: 5px;
            }
            td:nth-child(3) {
              background-color: #c8e6c9;
            }
          </style>
        </head>
        <body>
      <table>
        <tr>
          <td colspan="3">${rows[0].cells[0].textContent}</td>
        </tr>
        <tr>
          <td>配置总成本</td>
          <td>配置总重量</td>
          <td>配置总扫码价</td>
        </tr>
        <tr>
          <td>${rows[2].cells[0].textContent}</td>
          <td>${rows[2].cells[1].textContent}</td>
          <td>${rows[2].cells[2].textContent}</td>
        </tr>
        <tr>
          <td>售价</td>
          <td>对应折扣</td>
          <td>利润</td>
        </tr>
        ${dataRows.map(row => `
          <tr>
            <td>${row.cells[0].querySelector('input').value}</td>
            <td>${row.cells[1].querySelector('input').value}</td>
            <td>${row.cells[2].querySelector('input').value}</td>
          </tr>
        `).join('')}
      </table>
      </body>
      </html>
    `;

    const blob = new Blob([data], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = rows[0].cells[0].textContent+'.html';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

  const addBtn = document.createElement('button');
  addBtn.textContent = '！点击此处！设置任意单元格数据，自动计算另外两个';
  addBtn.style.backgroundColor='#253d24';
  addBtn.style.height = '45px';
  addBtn.style.color='#fbecde';
  removeBtn.style.height = '45px';
  addBtn.setAttribute('data-table-id', table.getAttribute('data-table-id'));
  productCombination.appendChild(addBtn);
  
  addBtn.addEventListener('click', () => {
    addBtn.style.display = 'none';
    
    const newRow = table.insertRow(4);
    const priceCell = newRow.insertCell(0);
    const discountCell = newRow.insertCell(1);
    const profitCell = newRow.insertCell(2);
    const actionCell = newRow.insertCell(3);
    
    // const priceInput = document.createElement('input');
    // priceInput.placeholder = '输入售价,自动输出对应折扣';
    // const discountInput = document.createElement('input');
    // discountInput.placeholder = '输入折扣,自动输出售价';
    // const profitInput = document.createElement('input');
    // profitInput.placeholder = '输入利润,自动输出售价和折扣';
    
    const priceInput = document.createElement('input');
    priceInput.placeholder = '输入售价,自动输出对应折扣';
    const discountInput = document.createElement('input');
    discountInput.placeholder = '输入折扣,自动输出售价';
    const profitInput = document.createElement('input');
    profitInput.placeholder = '输入利润,自动输出售价和折扣';
    
    const priceDiscountedInput = document.createElement('input');
    priceDiscountedInput.placeholder = '大促：'+ promotion*100 +'% 售价估算';
    priceDiscountedInput.readOnly = true;
    priceDiscountedInput.style.backgroundColor = '#ffdddd';
    const discountDiscountedInput = document.createElement('input');
    discountDiscountedInput.placeholder = '大促：'+ promotion*100 +'% 折扣估算';
    discountDiscountedInput.readOnly = true;
    discountDiscountedInput.style.backgroundColor = '#ffdddd';
    const profitDiscountedInput = document.createElement('input');
    profitDiscountedInput.placeholder = '大促：'+ promotion*100 +'% 利润估算';
    profitDiscountedInput.style.backgroundColor = '#ffdddd';
    profitDiscountedInput.readOnly = true;
    
    const priceTd = newRow.cells[0];
    const discountTd = newRow.cells[1];
    const profitTd = newRow.cells[2];
    
    priceCell.appendChild(priceInput);
    priceCell.appendChild(priceDiscountedInput);
    discountCell.appendChild(discountInput);
    discountCell.appendChild(discountDiscountedInput);
    profitCell.appendChild(profitInput);
    profitCell.appendChild(profitDiscountedInput);
    
    
    
    const addButton = document.createElement('button');
    addButton.textContent = '添加';
    const resetButton = document.createElement('button');
    resetButton.textContent = '重置';
    
    actionCell.appendChild(addButton);
    actionCell.appendChild(resetButton);

    //大促实时更新
    const updateAllDiscountedValues = () => {
      const price = parseFloat(priceInput.value);
      const discount = parseFloat(discountInput.value);
      const profit = parseFloat(profitInput.value);

      priceDiscountedInput.value = (price * (1 - promotion)).toFixed(2);
      discountDiscountedInput.value = (discount * (1 - promotion)).toFixed(2);
      profitDiscountedInput.value = (profit * (1 - promotion)).toFixed(2);
    };
    //售价
    priceInput.addEventListener('input', () => {

      const tableId = newRow.closest('table').getAttribute('data-table-id');
      const totalCost = parseFloat(document.querySelector(`table[data-table-id="${tableId}"] tr:nth-child(3) td:nth-child(1)`).textContent);
      const totalScanPrice = parseFloat(document.querySelector(`table[data-table-id="${tableId}"] tr:nth-child(3) td:nth-child(3)`).textContent);


      // 获取输入的售价,转换为浮点数
      const price = parseFloat(priceInput.value);
      
      
      // 设置售价单元格背景色为黄色
      priceCell.style.backgroundColor = 'yellow';
      
      // 设置对应折扣单元格背景色为绿色
      discountCell.style.backgroundColor = 'green';
      
      // 计算对应折扣并保留两位小数,赋值给对应折扣输入框
      discountInput.value = (price / totalScanPrice).toFixed(2);
      
      // 获取配置总成本,转换为浮点数
      //const totalCost = parseFloat(module3Table.rows[1].cells[1].textContent);
      
      // 获取预设值,转换为浮点数
      const presetValue = parseFloat(document.querySelector('.module-1 table td:nth-child(5) input').value);
      
      // 计算利润
      const profit = price - totalCost - (0.02 * price) - (presetValue * price);
      
      // 设置当前行背景色为半透明绿色
      newRow.style.backgroundColor = 'rgba(0, 255, 0, 0.3)';
      
      
      // 将利润保留两位小数并赋值给利润单元格
      profitInput.value = profit.toFixed(2);
      updateAllDiscountedValues();
    });
    //对应折扣
    discountInput.addEventListener('input', () => {

      const tableId = newRow.closest('table').getAttribute('data-table-id');
      const totalCost = parseFloat(document.querySelector(`table[data-table-id="${tableId}"] tr:nth-child(3) td:nth-child(1)`).textContent);
      const totalScanPrice = parseFloat(document.querySelector(`table[data-table-id="${tableId}"] tr:nth-child(3) td:nth-child(3)`).textContent);
        // 获取输入的对应折扣,转换为浮点数
        const discount = parseFloat(discountInput.value);
     
        
        // 获取配置总扫码价,转换为浮点数
        //const totalScanPrice = parseFloat(module3Table.rows[1].cells[3].textContent);
        
        // 设置对应折扣单元格背景色为黄色
        discountCell.style.backgroundColor = 'yellow';
        
        // 设置售价单元格背景色为绿色
        priceCell.style.backgroundColor = 'green';
        
        // 计算售价并保留两位小数
        const price = totalScanPrice * discount;
        
        // 将售价赋值给售价输入框
        priceInput.value = price.toFixed(2);
        
        // 获取配置总成本,转换为浮点数
        //const totalCost = parseFloat(module3Table.rows[1].cells[1].textContent);
        
        // 获取预设值,转换为浮点数
        const presetValue = parseFloat(document.querySelector('.module-1 table td:nth-child(5) input').value);
        
        // 计算利润
        const profit = price - totalCost - (0.02 * price) - (presetValue * price);
        
        // 将利润保留两位小数并赋值给利润单元格
        profitInput.value = profit.toFixed(2);
        updateAllDiscountedValues();
    });
    //利润
    profitInput.addEventListener('input', () => {

      const tableId = newRow.closest('table').getAttribute('data-table-id');
      const totalCost = parseFloat(document.querySelector(`table[data-table-id="${tableId}"] tr:nth-child(3) td:nth-child(1)`).textContent);
      const totalScanPrice = parseFloat(document.querySelector(`table[data-table-id="${tableId}"] tr:nth-child(3) td:nth-child(3)`).textContent);

      // 获取输入的利润,转换为浮点数
      const profit = parseFloat(profitInput.value);
      
      // 获取配置总成本,转换为浮点数
      //const totalCost = parseFloat(module3Table.rows[1].cells[1].textContent);
      
      // 获取预设值,转换为浮点数
      const presetValue = parseFloat(document.querySelector('.module-1 table td:nth-child(5) input').value);
      
      // 获取配置总扫码价,转换为浮点数
      //const totalScanPrice = parseFloat(module3Table.rows[1].cells[3].textContent);
      
      // 设置利润单元格背景色为黄色
      profitCell.style.backgroundColor = 'yellow';
      
      // 设置售价单元格背景色为绿色
      priceCell.style.backgroundColor = 'green';
      
      // 设置对应折扣单元格背景色为绿色
      discountCell.style.backgroundColor = 'green';
      
      // 计算售价
      const price = (profit + totalCost) / (1 - 0.02 - presetValue);
      
      // 将售价保留两位小数并赋值给售价输入框
      priceInput.value = price.toFixed(2);
      
      // 计算对应折扣并保留两位小数,赋值给对应折扣输入框
      discountInput.value = (price / totalScanPrice).toFixed(2);
      
      // 设置当前行背景色为半透明绿色
      newRow.style.backgroundColor = 'rgba(0, 255, 0, 0.3)';
      updateAllDiscountedValues();
    });

    resetButton.addEventListener('click', () => {
      priceInput.value = '';
      discountInput.value = '';
      priceCell.style.backgroundColor = 'white';
      discountCell.style.backgroundColor = 'white';
    });
    
    addButton.addEventListener('click', () => {
      // 设置售价输入框为只读
      priceInput.readOnly = true;
      // 设置对应折扣输入框为只读
      discountInput.readOnly = true;
      profitInput.readOnly = true;

      addButton.style.display = 'none';
      resetButton.style.display = 'none';
      
      const deleteButton = document.createElement('button');
      deleteButton.textContent = '删除';
      actionCell.appendChild(deleteButton);
      
      newRow.style.backgroundColor = 'rgba(0, 255, 0, 0.3)';
      
      addBtn.style.display = 'inline-block';
      
      deleteButton.addEventListener('click', () => {
        table.deleteRow(newRow.rowIndex);
        addBtn.style.display = 'inline-block';
      });
    });
  });
});

// 重置按钮功能
resetBtn.addEventListener('click', () => {
  sliders.forEach(slider => {
    slider.value = 0;
    slider.dispatchEvent(new Event('input'));
  });
});