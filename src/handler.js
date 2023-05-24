const { nanoid } = require("nanoid");
const { nanoid } = require("nanoid");

// ambil books.js
const books = require("./books");
const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  // ketika client tidak melampirkan name
  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  // ketika readPage lebih besar dari pagecount
  if (readPage > pageCount) {
    const response = h
      .response({
        status: "fail",
        message:
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
    return response;
  }

    // menambah buku baru
  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    insertedAt,
    updatedAt,
  };

  books.push(newBook); // push buku ke dalam array
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  // apabila buku berhasil ditambahkan
  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.status(201);
    return response;
  }

  // jika Gagal
  const response = h.response({
    status: "fail",
    message: "Buku gagal ditambahkan",
  });

  response.status(500);
  return response;
};

// menampilkan semua Buku
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  if (books.length === 0) {
    const response = h.response({
      status: "success",
      data: {
        books: [],
      },
    });
    response.status(200);
    return response;
  }

  let filteredBooks = books;
  if (typeof name !== 'undefined') {
  filteredBooks = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
}

if (typeof reading !== 'undefined') {
  filteredBooks = books.filter((book) => Number(book.reading) === Number(reading));
}

if (typeof finished !== 'undefined') {
  filteredBooks = books.filter((book) => Number(book.finished) === Number(finished));
}

  const response = h.response({
    status: "success",
    data: {
      books: filteredBooks.map(({ id, name, publisher }) => ({
        id,
        name,
        publisher,
      })),
    },
  });

  response.code(200);
  return response;

};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((n) => n.id === bookId)[0];
  if (typeof book !== 'undefined') {
    const response = h.response({
      status: "success",
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  // bila gagal
  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };

    // bila buku berhasil diperbaharui
    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

// delete books
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books.splice(index, 1);

    // apabila id dimiliki salah satu buku
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  // Bila id yang dilampirkan tidak dimiliki oleh buku manapun
  const response = h
    .response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    })
    response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
