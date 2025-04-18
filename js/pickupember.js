function pickUpEmber(emberCarried, ember, emberFollowing, player, keys, lastDirection, depthSortedObjects) {
    if (emberCarried) {
        // Set Ember down (follow beside player)
        ember.setVisible(true); // Make Ember visible again
        ember.x = player.x - 120;
        ember.y = player.y + 80;
        emberFollowing = true; // Ember follows the player
        emberCarried = false; // Ember is no longer carried
        player.setTexture("alex"); // Change back to Alex's normal texture
        handlePlayerMovementWithEmber(player, keys, lastDirection, depthSortedObjects);
    } else {
        // Pick up Ember (carry Ember)
        ember.setVisible(false); // Hide Ember
        emberFollowing = false; // Ember no longer follows the player
        emberCarried = true; // Ember is now carried
        player.setTexture("alexember"); // Change to Alex with Ember texture
        handlePlayerMovement(player, keys, lastDirection, depthSortedObjects);
    }
}