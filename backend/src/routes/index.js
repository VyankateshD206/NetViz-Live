const express = require('express');
const router = express.Router();
const { 
    handleNetworkData, 
    addNode, 
    addEdge, 
    deleteNode, 
    updateNode,
    deleteConnectedLinks 
} = require('../controllers');

// Get network data
router.get('/network', handleNetworkData);

// Add new node
router.post('/nodes', addNode);

// Add new edge
router.post('/edges', addEdge);

// Delete node
router.delete('/nodes/:id', deleteNode);

// Update node
router.put('/nodes/:id', updateNode);

// Delete connected links
router.delete('/nodes/:id/links', deleteConnectedLinks);

module.exports = router;