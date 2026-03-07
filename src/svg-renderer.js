/**
 * Nook SVG Sprite Renderer
 * Renders SVG sprites based on variant and state
 */

const { SVG_SPRITES } = require('./svg-sprites');

class SVGSpriteRenderer {
  constructor() {
    this.sprites = SVG_SPRITES;
  }

  /**
   * Get SVG string for a variant and state
   */
  render(variant = 'seed', state = 'idle') {
    const sprite = this.sprites[variant];
    if (!sprite) {
      console.warn(`Unknown variant: ${variant}, defaulting to seed`);
      return this.sprites.seed[state] || this.sprites.seed.idle;
    }

    return sprite[state] || sprite.idle;
  }

  /**
   * Get all available variants
   */
  getVariants() {
    return Object.keys(this.sprites);
  }

  /**
   * Get all states for a variant
   */
  getStates(variant = 'seed') {
    const sprite = this.sprites[variant];
    return sprite ? Object.keys(sprite) : [];
  }

  /**
   * Render all variants and states (for demo)
   */
  renderAll() {
    const output = [];
    for (const variant of this.getVariants()) {
      for (const state of this.getStates(variant)) {
        output.push({
          variant,
          state,
          svg: this.render(variant, state)
        });
      }
    }
    return output;
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SVGSpriteRenderer, SVG_SPRITES };
}
