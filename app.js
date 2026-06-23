let dados = JSON.parse(localStorage.getItem("inventario")) || {};

const inputQR = document.getElementById("inputQR");
const inputQtd = document.getElementById("inputQtd");

inputQR.addEventListener("change", function () {
  this.value = this.value.trim();
});

function registrar() {
  let texto = inputQR.value.trim();
  let qtd = parseInt(inputQtd.value);

  if (!texto || isNaN(qtd)) {
    alert("Preencha o QR Code e a quantidade.");
    return;
  }

  // 📌 Regra: 10 primeiros caracteres = código
  let codigo = texto.substring(0, 10).trim();
  let descricao = texto.substring(10).trim();

  if (!codigo) {
    alert("Código inválido.");
    return;
  }

  if (dados[codigo]) {
    let confirmar = confirm(
      `Código ${codigo} já existe.\nQuantidade atual: ${dados[codigo].quantidade}\n\nDeseja editar?`
    );

    if (confirmar) {
      dados[codigo].quantidade = qtd;

      // Atualiza descrição apenas se vier nova
      if (descricao) {
        dados[codigo].descricao = descricao;
      }
    }

  } else {
    dados[codigo] = {
      descricao: descricao || "",
      quantidade: qtd
    };
  }

  salvar();
  atualizarTabela();
  limparCampos();
}

function limparCampos() {
  inputQR.value = "";
  inputQtd.value = "";
  inputQR.focus();
}

function salvar() {
  localStorage.setItem("inventario", JSON.stringify(dados));
}

function atualizarTabela() {
  const tbody = document.getElementById("tabela");
  tbody.innerHTML = "";

  Object.keys(dados).forEach(codigo => {
    let item = dados[codigo];

    tbody.innerHTML += `
      <tr>
        <td>${codigo}</td>
        <td>${item.descricao || ""}</td>
        <td>${item.quantidade}</td>
        <td>
          <button onclick="remover('${codigo}')">❌</button>
        </td>
      </tr>
    `;
  });
}

function remover(codigo) {
  delete dados[codigo];
  salvar();
  atualizarTabela();
}

function exportarExcel() {
  let lista = [];

  Object.keys(dados).forEach(codigo => {
    lista.push({
      Codigo: codigo,
      Descricao: dados[codigo].descricao || "",
      Quantidade: dados[codigo].quantidade
    });
  });

  let ws = XLSX.utils.json_to_sheet(lista);
  let wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Inventario");

  XLSX.writeFile(wb, "inventario.xlsx");
}

atualizarTabela();