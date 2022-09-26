<div class="d-grid gap-2 m-3" id="hud">
<div class="d-grid gap-2 m-3" id="color-buttons" aria-label="color picker">
    <button type="button" class="btn btn-sm btn-danger">Red</button>
    <button type="button" class="btn btn-sm btn-warning">Yellow</button>
    <button type="button" class="btn btn-sm btn-success">Green</button>
    <button type="button" class="btn btn-sm btn-primary">Blue</button>
</div>
<div class="d-grid gap-2 m-3" id="player-info">
    <p id="player-energy"></p>
</div>
</div>

'use strict';

const e = React.createElement;

class LikeButton extends React.FC {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }

    return e(
      'button',
      { onClick: () => this.setState({ liked: true }) },
      'Like'
    );
  }
}