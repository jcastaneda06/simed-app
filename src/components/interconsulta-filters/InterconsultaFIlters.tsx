import { FC } from 'react'
import ClickAwayListener from '../click-away-listener/ClickAwayListener'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Activity, FileCheck, HeartPulse } from 'lucide-react'

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
  openFilters: boolean
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
    openFilters,
  } = props

  return (
    <div
      className={`${openFilters ? 'max-h-96' : 'max-h-0'} ${openFilters ? '' : 'overflow-hidden '}transition-all duration-300  ${openFilters ? ' border-t border-b mt-4 py-4' : ''}`}
    >
      <div className={`md:hidden flex flex-col gap-2 px-4 mb-4`}>
        <div className="flex justify-between items-center gap-2 ">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-muted-foreground" />{' '}
            <span className="text-muted-foreground text-sm">Servicio</span>
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
              <Label
                htmlFor="servicio"
                className="text-muted-foreground text-sm"
              >
                Servicio
              </Label>
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
              <Label
                htmlFor="departamento"
                className="text-muted-foreground text-sm"
              >
                Departamento
              </Label>
            </div>
          </div>
        </div>
        <ClickAwayListener onClickAway={() => setAbierto(false)}>
          <div className="flex-col">
            <Input
              value={searchFilter}
              onClick={handleInputClick}
              onChange={(e) => setSearchFilter(e.target.value)}
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
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex justify-start items-center gap-2">
            <FileCheck className="w-4 h-4 text-muted-foreground" />{' '}
            <span className="text-muted-foreground text-sm">Estado</span>
          </div>
          <Select
            value={filtros.estado || 'todos'}
            onValueChange={(value) => setFiltros('estado', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="PENDIENTE">Pendientes</SelectItem>
              <SelectItem value="EN_PROCESO">En proceso</SelectItem>
              <SelectItem value="COMPLETADA">Completadas</SelectItem>
              <SelectItem value="CANCELADA">Canceladas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <div className="flex justify-start items-center gap-2">
            <Activity className="w-4 h-4 text-muted-foreground" />{' '}
            <span className="text-muted-foreground text-sm">Prioridad</span>
          </div>
          <Select
            value={filtros.prioridad || 'todos'}
            onValueChange={(value) => setFiltros('prioridad', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas</SelectItem>
              <SelectItem value="BAJA">Baja</SelectItem>
              <SelectItem value="MEDIA">Media</SelectItem>
              <SelectItem value="ALTA">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:flex hidden flex-col flex-1 gap-2">
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-muted-foreground" />{' '}
              <span className="text-muted-foreground text-sm">Servicio</span>
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
                  <Label
                    htmlFor="servicio"
                    className="text-muted-foreground text-sm"
                  >
                    Servicio
                  </Label>
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
                  <Label
                    htmlFor="departamento"
                    className="text-muted-foreground text-sm"
                  >
                    Departamento
                  </Label>
                </div>
              </div>
            </div>
          </div>
          <ClickAwayListener onClickAway={() => setAbierto(false)}>
            <div className="flex-col">
              <Input
                value={searchFilter}
                onClick={handleInputClick}
                onChange={(e) => setSearchFilter(e.target.value)}
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
  )
}

export default InterconsultaFilters
