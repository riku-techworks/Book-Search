//Google Books APIのAPIキー
const api_key = "APIKEY";

//書籍情報を表示する要素の取得
const result = document.querySelector("#result");

//ボタンをクリックすると書籍情報を取得する
document.querySelector("#search_button").addEventListener(
  "click",
  function () {
    let book_input = document.querySelector("#book_name");
    let book_name = book_input.value.trim();

    if (book_name === "") {
      window.alert("書籍名を入力してください。");
      return;
    }

    bookSearch(book_name);
  },
  false,
);

//Google Books APIから書籍情報を取得する関数。処理は非同期に行う。
async function bookSearch(bookName) {
  try {
    let res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(bookName)}&key=${api_key}`,
    );
    if (res.ok) {
      //fetchメソッドが正常終了した場合の処理
      let data = await res.json();

      if (!data.items || data.items.length === 0) {
        window.alert("キーワードに一致する書籍がありませんでした。");
        return;
      }

      //書籍情報を格納するための配列
      let books = [];
      for (let item of data.items ?? []) {
        let book = new Book(
          item.volumeInfo.title ?? "タイトルはありません",
          item.volumeInfo.description ?? "説明文はありません",
          item.volumeInfo.infoLink ?? "#",
          item.volumeInfo.imageLinks?.smallThumbnail ?? "./images/noImage.jpg",
        );
        books.push(book);
      }

      let book_lists = document.createElement("ul");
      book_lists.classList.add("book_lists");

      for (let book of books) {
        book_lists.append(book.createBookElement());
      }

      result.replaceChildren(book_lists);
    } else {
      //fetchメソッドが異常終了した場合の処理
      throw new Error("書籍情報の取得に失敗しました。");
    }
  } catch (e) {
    console.log(e.message);
  }
}

//1冊の書籍情報を管理するクラス
class Book {
  #title;
  #description;
  #link;
  #image;

  constructor(title, description, link, image) {
    this.#title = title;
    this.#description = description;
    this.#link = link;
    this.#image = image;
  }

  createBookElement() {
    let li = document.createElement("li");
    let title = document.createElement("h3");
    let description = document.createElement("p");
    let anchor = document.createElement("a");
    let img = document.createElement("img");

    title.textContent = this.#title;
    description.textContent = this.#description;
    anchor.href = this.#link;
    img.src = this.#image;

    li.append(title);
    li.append(description);
    anchor.append(img);
    li.append(anchor);

    return li;
  }
}
