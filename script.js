const form = document.querySelector('.form-section')
const nomeInput = document.querySelector('#nomeProduto')
const precoInput = document.querySelector('#precoProduto')
const categoriaInput = document.querySelector('#categoriaProduto')
const btnNovoProduto = document.querySelector('.btn-adicionar')
const btnSalvarProduto = document.querySelector('.btn-salvar')
const btnCancelar = document.querySelector('.btn-cancelar')
const listaProdutos = document.querySelector('.lista-produtos')
const totalCarrinho = document.querySelector('.total-carrinho')
const produtos = JSON.parse(localStorage.getItem('produtos')) || []
const produtosSelecionados = JSON.parse(localStorage.getItem('carrinho')) || []
let produtoEditando = null
let nomeProdutoEditando = null
let precoProdutoEditando = null
let categoriaProdutoEditando = null
let elementoProdutoEditando = null

let dataIndex = produtos[produtos.length - 1]?.id || -1
let totalPreco = JSON.parse(localStorage.getItem('valorCarrinho')) || 0

function limparDados() {
    nomeInput.value = ''
    precoInput.value = ''
    categoriaInput.value = ''
    form.classList.remove('mostrar')
}

function atualizarProdutos() {
    localStorage.setItem('produtos', JSON.stringify(produtos))
}

function criaProduto(produto) {
    const produtoItem = document.createElement('div')
    produtoItem.classList.add('produto-item')
    produtoItem.setAttribute('data-index', `${dataIndex}`)

    const infoProduto = document.createElement('div')
    infoProduto.classList.add('info-produto')

    const nomeProduto = document.createElement('div')
    nomeProduto.classList.add('nome-produto')
    nomeProduto.textContent = `${produto.nome}`
    
    const precoProduto = document.createElement('div')
    precoProduto.classList.add('preco-produto')
    precoProduto.textContent = `${produto.preco}`
    
    const categoriaProduto = document.createElement('div')
    categoriaProduto.classList.add('categoria-produto')
    categoriaProduto.textContent = `${produto.categoria}`

    infoProduto.append(nomeProduto)
    infoProduto.append(precoProduto)
    infoProduto.append(categoriaProduto)

    const btnContainer = document.createElement('div')
    
    const btnEditar = document.createElement('button')
    btnEditar.classList.add('btn-editar')
    btnEditar.textContent = '✏️ Editar'

    const btnCarrinho = document.createElement('button')
    btnCarrinho.classList.add('btn-adicionar-carrinho')
    btnCarrinho.textContent = '🛒 Adicionar Carrinho'

    btnCarrinho.addEventListener('click', () => {
        if(!produtoItem.classList.contains('selecionado')) {
            produtosSelecionados.push(produto)
            totalPreco += parseFloat(produto.preco)
            produtoItem.classList.add('selecionado')
        }
        
        else {
            const index = produtosSelecionados.findIndex(p => p.id === produto.id)
            
            if (index !== -1) {
                produtosSelecionados.splice(index, 1)
            }
            totalPreco -= parseFloat(produto.preco)
            produtoItem.classList.remove('selecionado')
        }
        localStorage.setItem('valorCarrinho', JSON.stringify(totalPreco))
        localStorage.setItem('carrinho', JSON.stringify(produtosSelecionados))
        if(produtosSelecionados.length === 0) {
            localStorage.removeItem('carrinho')
        }
        totalCarrinho.textContent = `Total: R$ ${totalPreco}`
        
    })

    btnEditar.addEventListener('click', () => {
        form.classList.add('mostrar')
        produtoItem.style.display = 'none'
        nomeInput.value = produto.nome
        precoInput.value = produto.preco
        categoriaInput.value = produto.categoria
        produtoEditando = produto
        elementoProdutoEditando = produtoItem
        nomeProdutoEditando = nomeProduto
        precoProdutoEditando = precoProduto
        categoriaProdutoEditando = categoriaProduto
    })

    btnContainer.append(btnEditar)
    btnContainer.append(btnCarrinho)

    produtoItem.append(infoProduto)
    produtoItem.append(btnContainer)
    for (let i = 0; i < produtosSelecionados.length; i++) {
        if(produtosSelecionados[i].id === produto.id) {
            produtoItem.classList.add('selecionado')
        }
    }

    return produtoItem
}

btnNovoProduto.addEventListener('click', () => {
    form.classList.toggle('mostrar')
})

btnCancelar.addEventListener('click', () => {
    if (produtoEditando) {
        elementoProdutoEditando.style.display = 'flex'
        produtoEditando = null
        nomeProdutoEditando = null
        precoProdutoEditando = null
        categoriaProdutoEditando = null
        elementoProdutoEditando = null
    }
    limparDados()
})

btnSalvarProduto.addEventListener('click', () => {
    if(produtoEditando) {
        produtoEditando.nome = nomeInput.value
        produtoEditando.preco = precoInput.value
        produtoEditando.categoria = categoriaInput.value

        nomeProdutoEditando.textContent = produtoEditando.nome
        precoProdutoEditando.textContent = produtoEditando.preco
        categoriaProdutoEditando.textContent = produtoEditando.categoria

        elementoProdutoEditando.style.display = 'flex'
        atualizarProdutos()
        limparDados()
    }

    else {
        dataIndex++
        const produto = {
            id: dataIndex,
            nome: nomeInput.value,
            preco: precoInput.value,
            categoria: categoriaInput.value
        }
    
        produtos.push(produto)
        const produtoCriado = criaProduto(produto)
        listaProdutos.append(produtoCriado)
        atualizarProdutos()
        limparDados()
    }
})

produtos.forEach(produto => {
    const produtoCriado = criaProduto(produto)
    listaProdutos.append(produtoCriado)
});


totalCarrinho.textContent = `Total: R$ ${totalPreco}`