// In-memory storage for network data
let networkData = {
    nodes: [
        { 
            id: "1", 
            label: "Router 1", 
            device_type: "router",
            properties: {
                public_ip: "192.168.1.1",
                private_ip: "10.0.0.1",
                mac: "00:11:22:33:44:55"
            }
        },
        { 
            id: "2", 
            label: "Switch 1", 
            device_type: "switch",
            properties: {
                public_ip: "192.168.1.2",
                private_ip: "10.0.0.2",
                mac: "00:11:22:33:44:56"
            }
        }
    ],
    edges: [
        { source: "1", target: "2" }
    ]
};

// Add this helper function at the top after networkData declaration
const getNextDeviceName = (deviceType) => {
    const sameTypeNodes = networkData.nodes.filter(node => 
        node.device_type.toLowerCase() === deviceType.toLowerCase()
    );
    
    const numbers = sameTypeNodes.map(node => {
        const match = node.label.match(/\d+$/);
        return match ? parseInt(match[0]) : 0;
    });
    
    const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
    return `${deviceType.charAt(0).toUpperCase() + deviceType.slice(1)} ${nextNumber}`;
};

const handleNetworkData = async (req, res) => {
    try {
        res.json(networkData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addNode = async (req, res) => {
    try {
        const { device_type, properties } = req.body;
        const newNode = {
            id: Date.now().toString(),
            label: getNextDeviceName(device_type),
            device_type,
            properties: properties || {
                public_ip: "",
                private_ip: "",
                mac: ""
            }
        };
        networkData.nodes.push(newNode);
        res.json(newNode);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addEdge = async (req, res) => {
    try {
        const newEdge = req.body;
        networkData.edges.push(newEdge);
        res.json(newEdge);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteNode = async (req, res) => {
    try {
        const nodeId = req.params.id;
        networkData.nodes = networkData.nodes.filter(node => node.id !== nodeId);
        // Also remove any edges connected to this node
        networkData.edges = networkData.edges.filter(edge => 
            edge.source !== nodeId && edge.target !== nodeId
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateNode = async (req, res) => {
    try {
        const nodeId = req.params.id;
        const updatedData = req.body;
        
        networkData.nodes = networkData.nodes.map(node => 
            node.id === nodeId ? { ...node, ...updatedData } : node
        );
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add this new controller function before module.exports
const deleteConnectedLinks = async (req, res) => {
    try {
        const nodeId = req.params.id;
        // Remove all edges connected to this node
        networkData.edges = networkData.edges.filter(edge => 
            edge.source !== nodeId && edge.target !== nodeId
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update the module.exports
module.exports = {
    handleNetworkData,
    addNode,
    addEdge,
    deleteNode,
    updateNode,
    deleteConnectedLinks  // Add this line
};