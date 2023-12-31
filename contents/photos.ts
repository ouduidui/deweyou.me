import dayjs from 'dayjs'

const PHOTO_INFO: Array<{ location: string; date: `${number}-${number}-${number}`; prefix: string; suffix: string; count: number }> = [
  { location: '珠海', date: '2023-04-08', prefix: '230408-zhuhai', suffix: 'JPG', count: 5 },
  { location: '澳门', date: '2023-04-09', prefix: '230409-macao', suffix: 'JPG', count: 17 },
  { location: '武汉', date: '2023-05-26', prefix: '230526-wuhan', suffix: 'JPG', count: 6 },
  { location: '北京-前门 | 王府井 | 什刹海', date: '2023-06-10', prefix: '230610-beijing-qianmen-wangfujing-shishahai', suffix: 'JPG', count: 7 },
  { location: '北京-798艺术中心', date: '2023-07-09', prefix: '230709-beijing-798artCenter', suffix: 'JPG', count: 7 },
  { location: '北京-三里屯', date: '2023-07-15', prefix: '230715-beijing-sanlitun', suffix: 'JPG', count: 8 },
  { location: '深圳-深业上城', date: '2023-08-05', prefix: '230805-shenzhen-shenyeshangcheng', suffix: 'JPG', count: 12 },
  { location: '深圳-海上世界', date: '2023-08-19', prefix: '230819-shenzhen-haishangshijie', suffix: 'JPG', count: 9 },
  { location: '汕头-汕头老城', date: '2023-09-30', prefix: '230930-shantou-shantoulaocheng', suffix: 'JPG', count: 16 },
  { location: '深圳-万象城猫猫公园', date: '2023-10-14', prefix: '231014-shenzhen-wanxiangchengmaomaogongyuan', suffix: 'JPG', count: 7 },
  { location: '深圳-华侨城创意文化园', date: '2023-11-05', prefix: '231105-shenzhen-huaqiaochengchuangyiwenhuayuan', suffix: 'JPG', count: 9 },
  { location: '北京-圆明园', date: '2023-11-12', prefix: '231112-beijing-yuanmingyuan', suffix: 'JPG', count: 24 },
  { location: '香港', date: '2023-11-29', prefix: '231129-hongkong', suffix: 'JPG', count: 9 },
  { location: '长沙', date: '2023-12-24', prefix: '231224-changsha', suffix: 'JPG', count: 17 },
]

export const PHOTO_LIST = PHOTO_INFO.map(item => ({
  location: item.location,
  date: dayjs(item.date, 'YYYY-mm-dd'),
  photos: new Array(item.count).fill('').map((_, index) => ({
    url: `/photos/${item.prefix}-${index + 1}.${item.suffix}`,
  })),
})).sort((a, b) => a.date.isBefore(b.date) ? 1 : -1)
