function handlePlayerMovementWithEmber(player, keys, depthSortedObjects) {
    // Initialize movement tracking if needed
    if (player.lastDirection === undefined) {
        player.lastDirection = 'down';
        player.isMoving = false;
    }

    // Store previous movement state
    const wasMoving = player.isMoving;
    player.isMoving = false;
    player.setVelocity(0);

    // Handle movement inputs - now checking both WASD and arrow keys
    if (keys.left.isDown || keys.arrowLeft.isDown) {
        player.setVelocityX(-400);
        player.anims.play("alexember_walk", true);
        player.flipX = true;
        player.isMoving = true;
        player.lastDirection = 'left';
    } 
    else if (keys.right.isDown || keys.arrowRight.isDown) {
        player.setVelocityX(400);
        player.anims.play("alexember_walk", true);
        player.flipX = false;
        player.isMoving = true;
        player.lastDirection = 'right';
    } 
    else if (keys.up.isDown || keys.arrowUp.isDown) {
        player.setVelocityY(-400);
        player.anims.play("alexember_walk_front", true);
        player.isMoving = true;
        player.lastDirection = 'up';
    } 
    else if (keys.down.isDown || keys.arrowDown.isDown) {
        player.setVelocityY(400);
        player.anims.play("alexember_walk_back", true);
        player.isMoving = true;
        player.lastDirection = 'down';
    }

    // Handle transition to idle
    if (wasMoving && !player.isMoving) {
        player.anims.stop(); // Important - stop current animation first
        
        switch (player.lastDirection) {
            case 'left':
                player.anims.play("alexember_idle_side", true);
                player.flipX = true;
                break;
            case 'right':
                player.anims.play("alexember_idle_side", true);
                player.flipX = false;
                break;
            case 'up':
                player.anims.play("alexember_idle_back", true);
                break;
            case 'down':
                player.anims.play("alexember_idle_front", true);
                break;
        }
    }

    // Depth sorting (unchanged)
    if (player && player.body) {
        player.setDepth(player.getBottomCenter().y);
    }

    if (depthSortedObjects) {
        depthSortedObjects
            .filter(obj => obj && obj.getBottomCenter)
            .sort((a, b) => a.getBottomCenter().y - b.getBottomCenter().y)
            .forEach((obj, index) => obj.setDepth(index));
    }
}