function updateState(state, action) {
  return { ...state, ...action };
}

export class App {
  constructor({ state, components }) {
    this.state = state;
    this.initialized = false;

    this.dispatch = (action) => {
      const changes = Object.keys(action);

      state = updateState(state, action);

      this.syncState(state, changes);
    };

    this.components = components.flat().map((component) =>
      component({
        state,
        dispatch: this.dispatch,
      })
    );

    // tell components they've been attached to the DOM
    // This might be prone to breaking?
    this.components.forEach((component) => {
      if ("attached" in component) component.attached(state);
    });
  }

  syncState(state, changes) {
    this.state = state;
    this.components.forEach((component) => {
      component.syncState(state);
    });
  }
}
