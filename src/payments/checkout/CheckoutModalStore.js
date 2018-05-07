import ModalControllerStore from '../../common/stores/ModalControllerStore';

class CheckoutModalStore extends ModalControllerStore {
  route = 'CheckoutModal';
  defaultOpts = {
    confirmMessage: ''
  };
}

export default CheckoutModalStore;
