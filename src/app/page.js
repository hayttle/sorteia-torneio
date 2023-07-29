"use client"

import axios from "axios"
import {useEffect, useState} from "react"

export default function Home() {
  const delay = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingConfrontos, setIsLoadingConfrontos] = useState(false)
  const [categorias, setCategorias] = useState([])
  const [inscricoes, setInscricoes] = useState([])
  const [duplasSorteadas, setDuplasSorteadas] = useState([])
  const [confrontosGerados, setConfrontosGerados] = useState([])

  function sortearDuplas(atletas) {
    if (atletas.length % 2 !== 0) {
      throw new Error("O número de atletas deve ser par.")
    }

    const copiaAtletas = atletas.slice()

    const duplas = []

    while (copiaAtletas.length > 0) {
      const indiceAtleta1 = Math.floor(Math.random() * copiaAtletas.length)
      const atleta1 = copiaAtletas.splice(indiceAtleta1, 1)[0]

      const indiceAtleta2 = Math.floor(Math.random() * copiaAtletas.length)
      const atleta2 = copiaAtletas.splice(indiceAtleta2, 1)[0]

      duplas.push(`${atleta1} e ${atleta2}`)
    }

    return duplas
  }

  const getJogos = async (categoria_id) => {
    return await duplasSorteadas.find((duplaSorteada) => duplaSorteada.categoria_id == categoria_id)
  }

  const gerarConfrontosFemB = async (categoria_id) => {
    const confrontos = []
    const nameCategoria = getNameCategoria(categoria_id)

    const jogos = await getJogos(categoria_id)

    confrontos.push(`${jogos.duplas[0]} X ${jogos.duplas[1]}`)
    confrontos.push(`${jogos.duplas[2]} X ${jogos.duplas[3]}`)
    confrontos.push(`${jogos.duplas[0]} X ${jogos.duplas[3]}`)
    confrontos.push(`${jogos.duplas[1]} X ${jogos.duplas[2]}`)

    return {categoria: nameCategoria, categoria_id, confrontos}
  }

  const gerarConfrontosFemC = async (categoria_id) => {
    const confrontos = []
    const nameCategoria = getNameCategoria(categoria_id)
    const jogos = await getJogos(categoria_id)

    confrontos.push(`${jogos.duplas[0]} X ${jogos.duplas[1]}`)
    confrontos.push(`${jogos.duplas[2]} X ${jogos.duplas[3]}`)
    confrontos.push(`${jogos.duplas[0]} X ${jogos.duplas[3]}`)
    confrontos.push(`${jogos.duplas[1]} X ${jogos.duplas[2]}`)

    return {categoria: nameCategoria, categoria_id, confrontos}
  }

  const gerarConfrontosMascB = async (categoria_id) => {
    const confrontos = []
    const nameCategoria = getNameCategoria(categoria_id)
    const jogos = await getJogos(categoria_id)

    confrontos.push(`${jogos.duplas[0]} X ${jogos.duplas[1]}`)
    confrontos.push(`${jogos.duplas[2]} X ${jogos.duplas[3]}`)
    confrontos.push(`${jogos.duplas[0]} X ${jogos.duplas[3]}`)
    confrontos.push(`${jogos.duplas[1]} X ${jogos.duplas[2]}`)

    return {categoria: nameCategoria, categoria_id, confrontos}
  }

  const gerarConfrontosFemD = async (categoria_id) => {
    const confrontos = []
    const nameCategoria = getNameCategoria(categoria_id)
    const jogos = await getJogos(categoria_id)

    confrontos.push(`${jogos.duplas[0]} X ${jogos.duplas[1]}`)
    confrontos.push(`${jogos.duplas[2]} X ${jogos.duplas[3]}`)
    confrontos.push(`${jogos.duplas[4]} X ${jogos.duplas[0]}`)
    confrontos.push(`${jogos.duplas[1]} X ${jogos.duplas[3]}`)
    confrontos.push(`${jogos.duplas[2]} X ${jogos.duplas[4]}`)

    return {categoria: nameCategoria, categoria_id, confrontos}
  }

  const gerarConfrontosMascC = async (categoria_id) => {
    const confrontos = []
    const nameCategoria = getNameCategoria(categoria_id)
    const jogos = await getJogos(categoria_id)

    confrontos.push(`${jogos.duplas[0]} X ${jogos.duplas[1]}`)
    confrontos.push(`${jogos.duplas[2]} X ${jogos.duplas[3]}`)
    confrontos.push(`${jogos.duplas[4]} X ${jogos.duplas[5]}`)
    confrontos.push(`${jogos.duplas[6]} X ${jogos.duplas[7]}`)
    confrontos.push(`${jogos.duplas[0]} X ${jogos.duplas[4]}`)
    confrontos.push(`${jogos.duplas[1]} X ${jogos.duplas[5]}`)
    confrontos.push(`${jogos.duplas[2]} X ${jogos.duplas[6]}`)
    confrontos.push(`${jogos.duplas[3]} X ${jogos.duplas[7]}`)

    return {categoria: nameCategoria, categoria_id, confrontos}
  }

  const handleOnGerarConfrontos = async () => {
    if (!confirm("Tem certeza que deseja gerar os confrontos?")) {
      return
    }
    setIsLoadingConfrontos(true)

    await delay(2000)

    setIsLoadingConfrontos(false)

    const confrontos = []
    confrontos.push(await gerarConfrontosFemB(1))
    confrontos.push(await gerarConfrontosFemC(2))
    confrontos.push(await gerarConfrontosFemD(3))
    confrontos.push(await gerarConfrontosMascB(4))
    confrontos.push(await gerarConfrontosMascC(5))

    confrontos.forEach(async (confronto) => {
      try {
        await axios.post("http://localhost:3001/confrontos", confronto)
        setConfrontosGerados(confrontos)
      } catch (error) {
        console.log(error)
      }
    })
  }

  const handleOnClick = async (categoria) => {
    if (!confirm("Tem certeza que deseja realizar o sorteio das duplas desta categoria?")) {
      return
    }
    setIsLoading(true)

    await delay(2000)

    setIsLoading(false)

    const atletasInscritosnaCategoria = inscricoes.find((inscricao) => inscricao.categoria_id === categoria.id)
    const duplas = sortearDuplas(atletasInscritosnaCategoria.atletas)

    try {
      await axios.post(`http://localhost:3001/duplasSorteadas/`, {
        categoria: categoria.name,
        categoria_id: categoria.id,
        duplas
      })

      await axios.patch(`http://localhost:3001/categorias/${categoria.id}`, {drawed: true})
      axios.get("http://localhost:3001/categorias").then(({data}) => setCategorias(data))

      setDuplasSorteadas([...duplasSorteadas, {categoria: categoria.name, duplas}])
    } catch (error) {
      console.log(error)
    }
  }

  const handleOnReset = async (categoria_id) => {
    if (!confirm("Tem certeza que deseja zerar o sorteio desta categoria?")) {
      return
    }

    try {
      await axios.patch(`http://localhost:3001/categorias/${categoria_id}`, {drawed: false})
      axios.get("http://localhost:3001/categorias").then(({data}) => setCategorias(data))

      const responseDuplasSorteadas = await axios.get(
        `http://localhost:3001/duplasSorteadas?categoria_id=${categoria_id}`
      )
      const idSorteioParaResetar = responseDuplasSorteadas.data[0].id

      await axios.delete(`http://localhost:3001/duplasSorteadas/${idSorteioParaResetar}`)
      axios
        .get("http://localhost:3001/duplasSorteadas?_sort=categoria_id&_order=asc`")
        .then(({data}) => setDuplasSorteadas(data))

      axios.get("http://localhost:3001/confrontos").then(({data}) => setConfrontosGerados(data))
    } catch (error) {
      console.log(error)
    }
  }

  const getNameCategoria = (categoria_id) => {
    return categorias.find((categoria) => categoria.id === categoria_id).name
  }

  useEffect(() => {
    axios.get("http://localhost:3001/categorias").then(({data}) => setCategorias(data))
    axios.get("http://localhost:3001/inscricoes").then(({data}) => setInscricoes(data))
    axios
      .get("http://localhost:3001/duplasSorteadas?_sort=categoria_id&_order=asc`")
      .then(({data}) => setDuplasSorteadas(data))
    axios.get("http://localhost:3001/confrontos").then(({data}) => setConfrontosGerados(data))
  }, [])

  return (
    <main className="flex min-h-screen flex-col w-full items-center px-12 pb-24 pt-8 max-sm:px-3 bg-zinc-200">
      <div className="mb-8">
        <h2 className="text-center mb-1 font-semibold text-lg">Atletas inscritos</h2>
        <div className="flex justify-center flex-wrap gap-4">
          {inscricoes.map((inscricao, index) => (
            <div key={index} className="flex flex-col max-sm:min-w-full bg-white p-4 rounded-sm">
              <ul className="flex flex-col">
                <h2 className="font-semibold mb-2">Categoria {getNameCategoria(inscricao.categoria_id)}</h2>
                {inscricao.atletas.sort().map((atleta, index) => (
                  <li key={index} className="text-sm px-2 py-1 even:bg-slate-200 odd:bg-zinc-50">{`${
                    index + 1
                  } - ${atleta}`}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-8 max-sm:min-w-full">
        <h2 className="text-center mb-1 font-semibold text-lg">Sortear Duplas</h2>
        <div className="flex flex-col shadow-md bg-white divide-y px-4 py-2 w-full">
          {categorias.map((categoria, index) => (
            <div key={index} className=" text-sm flex items-center space-x-8 py-1 rounded-sm w-auto justify-between">
              <div>Categoria {categoria.name}</div>
              <div className="flex items-center space-x-2">
                <button
                  className="px-2 py-1 rounded-sm bg-emerald-400 hover:bg-emerald-500 disabled:bg-zinc-200 disabled:text-zinc-500 transition duration-300 ease-in-out"
                  onClick={() => handleOnClick(categoria)}
                  disabled={categoria.drawed}
                >
                  Sortear
                </button>

                <button
                  className="px-2 py-1 rounded-sm bg-red-300 hover:bg-red-400 disabled:bg-zinc-200 disabled:text-zinc-500 transition duration-300 ease-in-out"
                  onClick={() => handleOnReset(categoria.id)}
                  disabled={!categoria.drawed}
                >
                  Zerar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-2 font-semibold text-red-600 text-lg">{isLoading && <p>Sorteando...</p>}</div>
      <div className="w-full flex flex-col">
        {duplasSorteadas.length > 0 && (
          <>
            <h2 className="text-center mb-2 font-semibold text-lg">Duplas sorteadas</h2>
            <div className="flex flex-1 flex-wrap justify-center gap-4">
              {duplasSorteadas.map((duplaSorteada, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-between max-sm:w-full bg-white shadow-mdrounded-sm p-4"
                >
                  <div className=" max-sm:min-w-full ">
                    <h3 className="font-semibold bg-emerald-200 mb-2 px-2 py-1">Categoria {duplaSorteada.categoria}</h3>
                    <ul>
                      {duplaSorteada.duplas.map((dupla, index) => (
                        <li key={index} className="text-sm px-2 py-1 odd:bg-slate-200 even:bg-zinc-50">
                          {index + 1} - {dupla}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* <div className="w-full">
                    <button
                      className="w-full px-2 py-1 rounded-sm bg-yellow-400 hover:bg-yellow-500 transition duration-300 ease-in-out"
                      onClick={() => gerarConfrontosFemB()}
                    >
                      Gerar confrontos
                    </button>
                  </div> */}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {/* <div>
        <button
          className="mt-4 px-2 py-1 rounded-sm bg-yellow-400 hover:bg-yellow-500 disabled:bg-white disabled:text-zinc-500 transition duration-300 ease-in-out"
          onClick={() => handleOnGerarConfrontos()}
          disabled={confrontosGerados.length > 0}
        >
          Gerar confrontos
        </button>
      </div> */}
      <div className="mb-2 font-semibold text-red-600 text-lg">{isLoadingConfrontos && <p>Gerando...</p>}</div>

      <div className="w-full flex flex-col">
        {confrontosGerados.length > 0 && (
          <>
            <h2 className="text-center mb-2 font-semibold text-lg">Confrontos</h2>
            <div className="flex flex-1 flex-wrap justify-center gap-4">
              {confrontosGerados.map((confrontos, index) => (
                <div key={index} className="flex flex-col max-sm:w-full bg-white shadow-md rounded-sm p-4">
                  <h3 className="font-semibold bg-emerald-200 mb-2 px-2 py-1">Categoria {confrontos.categoria}</h3>
                  <ul>
                    {confrontos.confrontos.map((item, index) => (
                      <li key={index} className="text-sm px-2 py-1 odd:bg-slate-200 even:bg-zinc-50">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
