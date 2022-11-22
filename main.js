// 會使用MVC架構將程式碼模組化

// Declarative =======================
// 卡牌圖示
const symbols = [
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png', // 黑桃
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', // 愛心
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', // 方塊
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png' // 梅花
]

// View =======================
const view = {
  // 取得卡牌元素
  getCardElement(index){
    const number = this.transformNumber((index%13)+1) //卡牌數字
    const symbol = symbols[Math.floor(index / 13)] //卡牌圖示

    return `
    <div class="card">
      <p>${number}</p>
      <img src="${symbol}">
      <p>${number}</p>
    </div>
    `
  },

  // 產生卡牌
  displayCard(){
    const rootElement = document.querySelector('#cards')
    rootElement.innerHTML = this.getCardElement(11)
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



view.displayCard()