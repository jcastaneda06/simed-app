import { FC, useState } from 'react'
import ClickAwayListener from '../click-away-listener/ClickAwayListener'
import TextField from '../text-field/TextField'
import { Select, SelectItem } from '@/components/select/Select'
import { Activity, FileCheck, Filter, HeartPulse } from 'lucide-react'
import { Button } from '../button/Button'

type InterconsultaFiltersProps = {
  filtros: {
    estado: string
    prioridad: string
    idServicio: string
  }
  setFiltros: (key: string, value: string) => void
  searchFilter: string
  setSearchFilter: (value: string) => void
  searchFilterBy: 'servicio' | 'departamento'
  setSearchFilterBy: (value: 'servicio' | 'departamento') => void
  abierto: boolean
  setAbierto: (value: boolean) => void
  handleInputClick: () => void
  filterByServicio: () => JSX.Element
  filterByDepartamento: () => JSX.Element
}

const InterconsultaFilters: FC<InterconsultaFiltersProps> = (props) => {
  const {
    filtros,
    setFiltros,
    searchFilter,
    setSearchFilter,
    searchFilterBy,
    setSearchFilterBy,
    abierto,
    setAbierto,
    handleInputClick,
    filterByServicio,
    filterByDepartamento,
  } = props

  const [openFilters, setOpenFilters] = useState(false)
  return (
    <>
      <div className="flex justify-end z-[9999]">
        <Button
          text="Mostrar filtros"
          icon={<Filter className="h-4 w-4" />}
          variant="text"
          style={`mx-4 !justify-start !text-start !p-0 max-w-32 text-md ${openFilters ? '!text-blue-500' : ''}`}
          onClick={() => setOpenFilters(!openFilters)}
        />
      </div>
      <div
        className={`${openFilters ? 'max-h-96' : 'max-h-0'} ${openFilters ? '' : 'overflow-hidden '}transition-all duration-300  ${openFilters ? ' border-t border-b mt-4 py-4' : ''}`}
      >
        <div className={`md:hidden flex flex-col gap-2 px-4 mb-4`}>
          <div className="flex justify-between items-center gap-2 ">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-gray-500" />{' '}
              <span className="text-gray-500 text-sm">Servicio</span>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1">
                <input
                  type="radio"
                  id="servicio"
                  name="searchByMobile"
                  value="servicio"
                  checked={searchFilterBy === 'servicio'}
                  onChange={() => setSearchFilterBy('servicio')}
                />
                <label htmlFor="servicio" className="text-gray-500 text-sm">
                  Servicio
                </label>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="radio"
                  id="departamento"
                  name="searchByMobile"
                  value="departamento"
                  checked={searchFilterBy === 'departamento'}
                  onChange={() => setSearchFilterBy('departamento')}
                />
                <label htmlFor="departamento" className="text-gray-500 text-sm">
                  Departamento
                </label>
              </div>
            </div>
          </div>
          <ClickAwayListener onClickAway={() => setAbierto(false)}>
            <div className="flex-col">
              <TextField
                value={searchFilter}
                onClick={handleInputClick}
                onChange={(value) => setSearchFilter(value)}
                placeholder="Buscar..."
              />
              <div className="relative">
                {abierto &&
                  (searchFilterBy === 'servicio'
                    ? filterByServicio()
                    : searchFilterBy === 'departamento'
                      ? filterByDepartamento()
                      : null)}
              </div>
            </div>
          </ClickAwayListener>
        </div>
        <div className="flex gap-4 mx-4 md:mx-0">
          <div className="flex-1 flex flex-col">
            <div className="flex justify-start items-center gap-2">
              <FileCheck className="w-4 h-4 text-gray-500" />{' '}
              <span className="text-gray-500 text-sm">Estado</span>
            </div>
            <Select
              value={filtros.estado}
              onChange={(e) => setFiltros('estado', e.target.value)}
            >
              <SelectItem value="todos" selected={filtros.estado === ''}>
                Todos
              </SelectItem>
              <SelectItem value="PENDIENTE">Pendientes</SelectItem>
              <SelectItem value="EN_PROCESO">En proceso</SelectItem>
              <SelectItem value="COMPLETADA">Completadas</SelectItem>
              <SelectItem value="CANCELADA">Canceladas</SelectItem>
            </Select>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex justify-start items-center gap-2">
              <Activity className="w-4 h-4 text-gray-500" />{' '}
              <span className="text-gray-500 text-sm">Prioridad</span>
            </div>
            <Select
              value={filtros.prioridad}
              onChange={(e) => setFiltros('prioridad', e.target.value)}
            >
              <SelectItem value="todos" selected={filtros.prioridad === ''}>
                Todas
              </SelectItem>
              <SelectItem value="BAJA">Baja</SelectItem>
              <SelectItem value="MEDIA">Media</SelectItem>
              <SelectItem value="ALTA">Alta</SelectItem>
            </Select>
          </div>

          <div className="md:flex hidden flex-col flex-1 gap-2">
            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-gray-500" />{' '}
                <span className="text-gray-500 text-sm">Servicio</span>
              </div>
              <div className="flex gap-2">
                <div className="flex gap-2">
                  <div className="flex items-center gap-1">
                    <input
                      type="radio"
                      id="servicio"
                      name="searchBy"
                      value="servicio"
                      checked={searchFilterBy === 'servicio'}
                      onChange={() => setSearchFilterBy('servicio')}
                    />
                    <label htmlFor="servicio" className="text-gray-500 text-sm">
                      Servicio
                    </label>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="radio"
                      id="departamento"
                      name="searchBy"
                      value="departamento"
                      checked={searchFilterBy === 'departamento'}
                      onChange={() => setSearchFilterBy('departamento')}
                    />
                    <label
                      htmlFor="departamento"
                      className="text-gray-500 text-sm"
                    >
                      Departamento
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <ClickAwayListener onClickAway={() => setAbierto(false)}>
              <div className="flex-col">
                <TextField
                  value={searchFilter}
                  onClick={handleInputClick}
                  onChange={(value) => setSearchFilter(value)}
                  placeholder="Buscar..."
                />
                <div className="relative">
                  {abierto &&
                    (searchFilterBy === 'servicio'
                      ? filterByServicio()
                      : searchFilterBy === 'departamento'
                        ? filterByDepartamento()
                        : null)}
                </div>
              </div>
            </ClickAwayListener>
          </div>
        </div>
      </div>
    </>
  )
}

export default InterconsultaFilters
