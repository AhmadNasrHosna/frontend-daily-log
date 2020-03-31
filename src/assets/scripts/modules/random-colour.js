class RandomColour {
  constructor() {
    this.randomColourTrigger = document.querySelector(
      ".js-randomColourTrigger"
    );
    this.events();
  }

  events() {
    this.randomColourTrigger.addEventListener("click", () =>
      this.handleColourUpdate()
    );
  }

  handleColourUpdate() {
    const randomNumber = Math.floor(Math.random() * 360);

    document.documentElement.style.setProperty(
      "--color-secondary-h",
      "calc(var(--color-primary-h) + 180)"
    );

    document.documentElement.style.setProperty(
      "--color-primary-h",
      randomNumber
    );
  }
}

export default RandomColour;
