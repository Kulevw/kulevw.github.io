import { makeEventEmitter, type EventEmitter } from '@/utils/event-emitter'

export interface BaseGraphNode {
  key: number
  graph: BaseGraph
  edges: BaseGraphNode[]
  isAvailableEdge(edge: BaseGraphNode): boolean
  setWeightToEdge(edge: BaseGraphNode, weight: number): void
  getRelation(key: number): GraphNodeRealation | null
}

export interface BaseGraph {
  type: string
  nodes: BaseGraphNode[]
}

type GraphEvents = {
  'relation-updated'(from: BaseGraphNode, to: BaseGraphNode): void
  'node-isolated'(node: BaseGraphNode): void
  isolated(): void
}

export interface GraphNodeRealation<P extends string = string> {
  position: P
  key: number
  weight: number
  setWeight(value: number): void
}

export interface GraphNode<
  G extends BaseGraph = BaseGraph,
  P extends string = string,
  R extends GraphNodeRealation<P> = GraphNodeRealation<P>,
  N extends BaseGraphNode = BaseGraphNode,
> extends BaseGraphNode {
  graph: G
  key: number
  edges: N[]
  relations: R[]
  getRelation(key: number): R | null
  getEdgeByPosition(position: P): N | null
  isAvailableEdge(edge: N): boolean
  setWeightToEdge(edge: N, weight: number): void
  isolate(): void
}

export interface Graph<N extends BaseGraphNode = BaseGraphNode, T extends string = string>
  extends BaseGraph, EventEmitter<GraphEvents> {
  type: T
  nodes: N[]
  nodesMap: Map<number, N>
  getNodeByKey(key: number): N | null
  isolate(): void
}

export const makeGraph = <N extends GraphNode, T extends string>(
  type: T,
  nodes: N[],
  nodesMap: Map<number, N>,
): Graph<N, T> => {
  const getNodeByKey = (key: number) => nodesMap.get(key) ?? null

  const isolate = () => {
    nodes.forEach((node) => node.isolate())
    graph.emit('isolated')
  }

  const graph = {
    ...makeEventEmitter<GraphEvents>(),
    type,
    nodes,
    nodesMap,
    getNodeByKey,
    isolate,
  }

  return graph
}

export const makeGraphNode = <
  N extends BaseGraphNode,
  G extends Graph<N>,
  P extends string = string,
  R extends GraphNodeRealation<P> = GraphNodeRealation<P>,
>(
  graph: G,
  key: number,
  edges: N[],
  edgesMap: Map<P, N>,
  relations: R[],
  relationsMap: Map<number, R>,
): GraphNode<G, P, R, N> => {
  const getEdgeByPosition = (position: P) => edgesMap.get(position) ?? null

  const isAvailableEdge = (edge: N) => (relationsMap.get(edge.key)?.weight ?? 0) > 0

  const getRelation = (key: number) => relationsMap.get(key) ?? null

  const setWeightToEdge = (edge: N, weight: number) => {
    getRelation(edge.key)?.setWeight(weight)
    edge.getRelation(key)?.setWeight(weight)

    graph.emit('relation-updated', node, edge)
  }

  const isolate = () => {
    relations.forEach((relation) => relation.setWeight(0))

    graph.emit('node-isolated', node)
  }

  const node = {
    graph,
    key,
    edges,
    relations,
    getEdgeByPosition,
    isAvailableEdge,
    getRelation,
    setWeightToEdge,
    isolate,
  }

  return node
}
