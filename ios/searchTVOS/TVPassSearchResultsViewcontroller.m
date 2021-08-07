//
//  TVPassSearchResultsViewcontroller.m
//  TVapp
//
//  Created by Mac-OBS-23 on 18/03/21.
//

#import "TVPassSearchResultsViewcontroller.h"

@implementation TVPassSearchResultsViewcontroller

-(instancetype)initWithReactViewController:(UIViewController *)reactViewController{
  if(self = [super init]){
    _reactViewController = reactViewController;
    return self;
  }
  return nil;
}

-(void)viewDidLoad
{
  [super viewDidLoad];
  [self.view addSubview:self.reactViewController.view];
}

@end
