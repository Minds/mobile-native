export type TranslationType = typeof en;

const en = {
  messages: {
    running: {
      title: 'Capture Code',
      detail:
        'Align and center your 6-digit code in the rectangular area above to verify your account.',
      action: 'Resend code',
    },
    timeout: {
      title: 'Timed out',
      detail:
        "We noticed you weren't able to align the code. Make sure to center the code in the box.",
      action: 'Try Again',
    },
    error: {
      title: 'Error',
      detail: 'An error occurred, please try again.',
      action: 'Try Again',
    },
    expired: {
      title: 'Error',
      detail: 'Verification request expired.',
      action: 'Resend code',
    },
    permissionError: {
      title: 'Permissions',
      detail:
        'Please grant camera & geo-location permissions to proceed with the verification',
      action: 'Try Again',
    },
    codeReqError: {
      title: 'Sorry!',
      detail: 'The code request has failed.',
      action: 'Please try again',
    },
    success: {
      title: 'Success',
      detail: 'Congrats you successfully aligned and verified your code.',
      action: 'Continue',
    },
    uploading: {
      title: 'Processing',
      detail: 'Please wait...',
      action: '',
    },
  },
};

export default en;
