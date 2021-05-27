//
//  NotificationService.m
//  ImageNotification
//
//  Created by Martin Santangelo on 27/05/2021.
//

#import "NotificationService.h"

@interface NotificationService ()

@property (nonatomic, strong) void (^contentHandler)(UNNotificationContent *contentToDeliver);
@property (nonatomic, strong) UNMutableNotificationContent *bestAttemptContent;

@end

@implementation NotificationService

- (void)didReceiveNotificationRequest:(UNNotificationRequest *)request withContentHandler:(void (^)(UNNotificationContent * _Nonnull))contentHandler {
    self.contentHandler = contentHandler;
    self.bestAttemptContent = [request.content mutableCopy];
    
    // The `userInfo` property isn't available on newer versions of tvOS.
    #if TARGET_OS_IOS || TARGET_OS_OSX || TARGET_OS_WATCH
      NSString *currentImageURL = self.bestAttemptContent.userInfo[@"largeIcon"];
      if (!currentImageURL) {
        [self deliverNotification];
        return;
      }
      NSURL *attachmentURL = [NSURL URLWithString:currentImageURL];
      if (attachmentURL) {
        [self loadAttachmentForURL:attachmentURL
                completionHandler:^(UNNotificationAttachment *attachment) {
                  if (attachment != nil) {
                    self.bestAttemptContent.attachments = @[ attachment ];
                  }
                  [self deliverNotification];
                }];
      } else {
        [self deliverNotification];
      }
    #else
      [self deliverNotification];
    #endif
}

- (void)serviceExtensionTimeWillExpire {
    // Called just before the extension will be terminated by the system.
    // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.
    self.contentHandler(self.bestAttemptContent);
}

- (void)deliverNotification {
  if (self.contentHandler) {
    self.contentHandler(self.bestAttemptContent);
  }
}

- (NSString *)fileExtensionForResponse:(NSURLResponse *)response {
  NSString *suggestedPathExtension = [response.suggestedFilename pathExtension];
  if (suggestedPathExtension.length > 0) {
    return [NSString stringWithFormat:@".%@", suggestedPathExtension];
  }
  if ([response.MIMEType containsString:@"image/"]) {
    return [response.MIMEType stringByReplacingOccurrencesOfString:@"image/"
                                                        withString:@"."];
  }
  return @"";
}

- (void)loadAttachmentForURL:(NSURL *)attachmentURL
           completionHandler:(void (^)(UNNotificationAttachment *))completionHandler {
  __block UNNotificationAttachment *attachment = nil;

  NSURLSession *session = [NSURLSession
      sessionWithConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration]];
  [[session
      downloadTaskWithURL:attachmentURL
        completionHandler:^(NSURL *temporaryFileLocation, NSURLResponse *response, NSError *error) {
          if (error != nil) {
           
            completionHandler(attachment);
            return;
          }

          NSFileManager *fileManager = [NSFileManager defaultManager];
          NSString *fileExtension = [self fileExtensionForResponse:response];
          NSURL *localURL = [NSURL
              fileURLWithPath:[temporaryFileLocation.path stringByAppendingString:fileExtension]];
          [fileManager moveItemAtURL:temporaryFileLocation toURL:localURL error:&error];
          if (error) {
            completionHandler(attachment);
            return;
          }

          attachment = [UNNotificationAttachment attachmentWithIdentifier:@""
                                                                      URL:localURL
                                                                  options:nil
                                                                    error:&error];
          if (error) {
            completionHandler(attachment);
            return;
          }
          completionHandler(attachment);
        }] resume];
}

@end
