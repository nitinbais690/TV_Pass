//
//  TVPassSearchComponent.m
//  TVapp
//
//  Created by Mac-OBS-23 on 18/03/21.
//

#import "TVPassSearchComponent.h"
#import <React/RCTComponent.h>
#import <React/UIView+React.h>
#import "TVPassSearchResultsViewcontroller.h"

@implementation TVPassSearchComponent

-(void)layoutSubviews
{
  [super layoutSubviews];
  if(self.containerVC){
    return;
  }
  
  UIViewController *reactController = self.reactSubviews.firstObject.reactViewController;
  TVPassSearchResultsViewcontroller *resultsVC = [[TVPassSearchResultsViewcontroller alloc] initWithReactViewController:reactController];
  UISearchController *searchController = [[UISearchController alloc] initWithSearchResultsController:resultsVC];
  searchController.view.backgroundColor = [UIColor clearColor];
  searchController.searchResultsUpdater = self;
  searchController.searchBar.backgroundColor = [UIColor clearColor];
  
  [searchController.searchBar becomeFirstResponder];
  
  self.containerVC = [[UISearchContainerViewController alloc] initWithSearchController:searchController];
  self.containerVC.tabBarItem = self.reactViewController.tabBarItem;
  
  UITabBarController *tabBarVC = self.reactViewController.tabBarController;
  tabBarVC.tabBar.hidden = YES;
  NSMutableArray *viewControllers = tabBarVC.viewControllers.mutableCopy;
  NSUInteger index = [tabBarVC.viewControllers indexOfObject:self.reactViewController];
  [viewControllers replaceObjectAtIndex:index withObject:self.containerVC];
  tabBarVC.viewControllers = viewControllers;
  
  UIView *rootView = tabBarVC.view.window.rootViewController.view;
  for(UIGestureRecognizer *recognizer in rootView.gestureRecognizers){
    if([recognizer.allowedPressTypes containsObject:@(UIPressTypeSelect)] && [recognizer isKindOfClass:[UITapGestureRecognizer class]]){
      [recognizer.view removeGestureRecognizer:recognizer];
    }
  }
  
  
}

-(void)updateSearchResultsForSearchController:(nonnull UISearchController *)searchController{
  if(self.onChangeText){
    self.onChangeText(@{@"text": searchController.searchBar.text});
  }
}

@end
