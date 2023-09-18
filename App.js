export class App {
  constructor({ state, dispatch, components }) {
    this.state = state;
    this.initialized = false;

    this.components = components
      .flat()
      .map((component) => component({ state, dispatch }));

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
