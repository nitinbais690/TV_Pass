//
//  TVPassSearchComponentManager.m
//  TVapp
//
//  Created by Mac-OBS-23 on 18/03/21.
//

#import "TVPassSearchComponentManager.h"
#import "TVPassSearchComponent.h"

@implementation TVPassSearchComponentManager

RCT_EXPORT_MODULE(TVPassSearchComponent)

RCT_EXPORT_VIEW_PROPERTY(onChangeText, RCTBubblingEventBlock)

-(UIView *)view{
  return [[TVPassSearchComponent alloc] init];
}

@end
