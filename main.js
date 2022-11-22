// 會使用MVC架構將程式碼模組化

// Declarative(宣告) =======================
// 卡牌圖示
const symbols = [
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png', // 黑桃
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', // 愛心
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', // 方塊
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png' // 梅花
]

// View(介面) =======================
const view = {
  // 取得卡牌，預設為蓋牌狀態
  getCardElement(index){
    return `
    <div class="card back" data-index="${index}"></div>
    `
  },

  //取得卡牌內元素
  getCardContent(index){
    const number = this.transformNumber((index%13)+1) //卡牌數字
    const symbol = symbols[Math.floor(index / 13)] //卡牌圖示

    return `
      <p>${number}</p>
      <img src="${symbol}">
      <p>${number}</p>
    `
  },

  // 產生卡牌
  displayCard(){
    const rootElement = document.querySelector('#cards')
    rootElement.innerHTML = utility.getRandomNubmerArray(52).map(index => this.getCardElement(index)).join("")
  },

  // 翻轉卡牌
  flipCard(card){
    // 如果是背面(back)就轉正面(取得卡片數字及花色)
    if(card.classList.contains('back')){
      card.classList.remove('back')
      card.innerHTML = this.getCardContent(card.dataset.index) 
      return
    }

    // 如果是正面就蓋牌
    card.classList.add('back')
    card.innerHTML = null
  },

  //特殊數字轉換 [1,11,12,13的卡牌要換成A,J,Q,K]
  transformNumber(number){
    switch(number){
      case 1:
        return 'A'
      case 11:
        return 'J'
      case 12:
        return 'Q'
      case 13:
        return 'K'
      default:
        return number
    }
  }


}

// Utility(外掛函式) =======================
const utility = {
  // 隨機重組數字(洗牌演算法：Fisher-Yates Shuffle)
  getRandomNubmerArray(count){
    const number = Array.from(Array(count).keys())
    for(let index = number.length-1; index > 0; index--){
      let random_index = Math.floor(Math.random() * (index + 1))
      ;[number[index], number[random_index]] = [number[random_index], number[index]]
    }
    return number
  }

}


// Execute(執行) =======================

//產製及顯示卡牌
view.displayCard()

//監聽卡牌點擊
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', event => {
    view.flipCard(card)
  })
})

