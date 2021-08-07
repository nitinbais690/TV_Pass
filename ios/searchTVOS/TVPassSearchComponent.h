//
//  TVPassSearchComponent.h
//  TVapp
//
//  Created by Mac-OBS-23 on 18/03/21.
//

#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@interface TVPassSearchComponent : UIView

@property UISearchContainerViewController *containerVC;

@property (nonatomic, copy) RCTBubblingEventBlock onChangeText; 

@end

