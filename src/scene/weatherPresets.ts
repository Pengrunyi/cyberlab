export const weatherPresets={
 clear:{label:'霓虹晴夜',rain:0,mist:.2,fog:.0025,tint:[1.04,.9,1.12]},
 drizzle:{label:'细雨',rain:.35,mist:.6,fog:.004,tint:[.9,1.02,1.08]},
 storm:{label:'暴雨',rain:1,mist:1,fog:.0036,tint:[.82,1.03,1.06]},
 fog:{label:'浓雾',rain:.06,mist:2.3,fog:.009,tint:[.96,.86,1.16]}
} as const;
export type WeatherId=keyof typeof weatherPresets;
