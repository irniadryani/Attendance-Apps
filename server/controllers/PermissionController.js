const permissionModel = require("../models/PermissionModel");

const getPermission = (req, res) => {
    // Implementasi fungsi untuk mendapatkan izin
    res.send("GET Permissions");
};

const getPermissionById = (req, res) => {
    // Implementasi fungsi untuk mendapatkan izin berdasarkan ID
    res.send(`GET Permission with ID ${req.params.id}`);
};

const createPermission = (req, res) => {
    // Implementasi fungsi untuk membuat izin baru
    res.send("POST Permission");
};

const updatePermission = (req, res) => {
    // Implementasi fungsi untuk memperbarui izin
    res.send(`PUT Permission with ID ${req.params.id}`);
};

const deletePermission = (req, res) => {
    // Implementasi fungsi untuk menghapus izin
    res.send(`DELETE Permission with ID ${req.params.id}`);
};

module.exports = {
    getPermission,
    getPermissionById,
    createPermission,
    updatePermission,
    deletePermission,
};
