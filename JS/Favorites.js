import { GithubUser } from "./GithubUser.js"

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    const validName = username.toUpperCase();
    username = validName
    console.log(validName);

    try {
      const userExist = this.entries.find(entry => entry.login.toLowerCase() === username.toLowerCase())

      if (userExist) {
        throw new Error('Usuário já cadastrado!')
      }

      const user = await GithubUser.search(username);

      if (user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch (error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filtroDeEntradas = this.entries
      .filter(entry => entry.login !== user.login);

    this.entries = filtroDeEntradas
    this.update()
    this.save()
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)
    this.tbody = this.root.querySelector('table tbody')
    this.update()
    this.onadd()
  }

  onadd() {
    const addButton = this.root.querySelector('.search button');
    let input = this.root.querySelector('.search input');

    addButton.onclick = () => {
      this.add(input.value)
      input.value = ''
    }

    window.onkeydown = (handleKeydown) => {
      if (handleKeydown.key === 'Enter') {
        this.add(input.value)
        input.value = ''
      }
    }
  }

  update() {
    this.removeAllTr()

    this.entries.forEach(user => {
      const row = this.createRow()
      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const canDelete = confirm('Tem certeza que deseja deletar esse usuário?')
        if (canDelete) {
          this.delete(user)
        }
      }
      this.tbody.append(row)
    });
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach((tr) => { tr.remove() });
  }

  createRow() {
    const tr = document.createElement('tr')
    tr.innerHTML = ` 
      <td class="user">
        <img src="https://github.com/BeatrizFabiano.png" alt="imagem de BeatrizFabiano">
        <a href="https://github.com/BeatrizFabiano" target="_blank">
          <p>Beatriz Fabiano</p>
          <span>BeatrizFabiano</span>
        </a>
      </td>
      <td class="repositories"> 76 </td>
      <td class="followers"> 9582 </td>
      <td>
       <button class="remove">
          Remover
        </button>
      </td>
  `
    return tr;
  }
};