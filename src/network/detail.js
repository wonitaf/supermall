import {request} from "./request";

export function getDetail(iid) {
  return request({
    url:'/detail',
    params: {
      iid
    }
  })
}
export function getRecommend() {
  return request({
    url:'/recommend'
  })
}


// 封装一个对象用于商品信息子组件只接收需要的数据
export  class Goods {
  constructor(itemInfo, columns, services) {
    this.title = itemInfo.title;
    this.desc = itemInfo.desc;
    this.newPrice = itemInfo.price;
    this.oldPrice = itemInfo.oldPrice;
    this.realPrice = itemInfo.lowNowPrice;
    this.discount = itemInfo.discountDesc;
    this.discountBgColor = itemInfo.discountBgColor
    this.columns = columns;
    this.services = services;
  }
}

// 封装一个对象用于商家信息组件的数据的接收
export class Shop {
  constructor(shopInfo) {
    this.logo = shopInfo.shopLogo;
    this.name = shopInfo.name;
    this.fans = shopInfo.cFans;
    this.sells = shopInfo.cSells;
    this.score = shopInfo.score;
    this.goodsCount = shopInfo.cGoods;
  }
}

// 封装商品参数对象
export class GoodsParam {
  constructor(info,rule) {
    this.image = info.images ? info.images[0] : '';
    this.infos = info.set;
    this.sizes = rule.tables;
  }
}

