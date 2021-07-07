const createBottomModalStore = () => ({
  visible: false,
  error: '',
  show() {
    this.visible = true;
  },
  hide() {
    this.visible = false;
  },
  setError(error: string) {
    this.error = error;
  },
});

export type BottomModalStore = ReturnType<typeof createBottomModalStore>;
export default createBottomModalStore;
