/* eslint-disable @typescript-eslint/no-explicit-any */
import Client, { SearchParams } from "fhir-kit-client";
import FhirType from "./Utils/Fhirtypes";

import {
  Bundle,
  OperationOutcome,
  FhirResource,
  CodeableConcept,
} from "fhir/r4";
import { OpPatch } from "fhir-kit-client/types/externals";

/**
 * Represents a service for interacting with FHIR resources.
 * @template T - The type of FHIR resource.
 */
export default class FhirResourceService<T extends FhirResource> {
  public resourceTypeName: string;

  public apiUrl: string;
  public fhirClient: Client;

  private _resourceBundle: Bundle;

  public hasNextPage: boolean = false;
  public hasPrevPage: boolean = false;

  /**
   * Creates an instance of ResourceService.
   * @param {FhirType} type - The FHIR resource type.
   */
  public constructor(type: FhirType) {
    this.apiUrl =
      import.meta.env.VITE_API_URL || "https://hapi.fhir.org/baseR4"; //TODO: Forzar a que el env esté o si no enviar error.
    const jwtToken = localStorage.getItem("access_token");
    this.fhirClient = new Client({
      baseUrl: this.apiUrl,
      bearerToken: jwtToken!,
    });
    this._resourceBundle = {} as Bundle;
    this.resourceTypeName = type;
  }

  /**
   * Handles the result of a FHIR operation.
   * @private
   * @template T - The type of the result.
   * @param {Promise<T>} result - The result of the FHIR operation.
   * @returns {Promise<Result<T>>} - The handled result.
   */
  private handleResult<T>(result: Promise<T>): Promise<Result<T>> {
    return result
      .then((data: T) => {
        return { success: true, data } as Result<T>;
      })
      .catch((error: any) => {
        console.error("handleResult:", error);
        return {
          success: false,
          error:
            this.parseOperationOutcome(error.response?.data) ||
            error.message ||
            error.response.data ||
            error,
        } as Result<T>;
      });
  }

  /**
   * Sets the flags indicating whether there is a next or previous page of resources.
   * @private
   * @param {Bundle} response - The FHIR bundle response.
   */
  private setNewPages(response: Bundle) {
    this.hasNextPage = !!response.link?.find((link) => link.relation === "next")
      ?.url;
    this.hasPrevPage = !!response.link?.find(
      (link) => link.relation === "previous"
    )?.url;
  }

  /**
   * Retrieves a FHIR resource by its ID.
   * @param {string} id - The ID of the resource.
   * @returns {Promise<Result<T>>} - The result of the operation.
   */
  public async getById(id: string): Promise<Result<T>> {
    return this.handleResult<T>(
      this.fhirClient.read({
        resourceType: this.resourceTypeName,
        id: id,
      }) as Promise<T>
    );
  }

  public async getResource(reference: string): Promise<Result<T>> {
    if (!reference) return { success: false, error: "Reference is empty" };

    try {
      const splitReference = reference.split("/");

      if (splitReference.length < 2) {
        throw new Error("Invalid reference format");
      }

      return this.handleResult<T>(
        this.fhirClient.read({
          resourceType: splitReference[0],
          id: splitReference[1],
        }) as Promise<T>
      );
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, error: error.message };
      } else {
        return { success: false, error: error + " An unknown error occurred" };
      }
    }
  }

  public async getVbyId(id: string, version: string): Promise<Result<T>> {
    return this.handleResult<T>(
      this.fhirClient.vread({
        resourceType: this.resourceTypeName,
        id: id,
        version: version,
      }) as Promise<T>
    );
  }

  /**
   * Retrieves the history of a FHIR resource by its ID.
   * @param {string} id - The ID of the resource.
   * @returns {Promise<Result<T[]>>} - The result of the operation.
   */
  public async getHistoryById(id: string): Promise<Result<T[]>> {
    const result = await this.handleResult<Bundle>(
      this.fhirClient.history({
        resourceType: this.resourceTypeName,
        id: id,
      }) as Promise<Bundle>
    );

    if (result.success) {
      const resources =
        result.data.entry?.map((entry) => entry.resource as T) || [];
      return { success: true, data: resources };
    } else {
      return { success: false, error: result.error };
    }
  }

  /**
   * Creates a new FHIR resource.
   * @param {T} newResource - The new resource to create.
   * @returns {Promise<Result<T>>} - The result of the operation.
   */
  public async postResource(newResource: T): Promise<Result<T>> {
    return this.handleResult<T>(
      this.fhirClient.create({
        resourceType: this.resourceTypeName,
        body: newResource,
      }) as Promise<T>
    );
  }

  public async patchResource(id: string, patch: OpPatch[]): Promise<Result<T>> {
    return this.handleResult<T>(
      this.fhirClient.patch({
        resourceType: this.resourceTypeName,
        id: id,
        JSONPatch: patch,
      }) as Promise<T>
    );
  }

  /**
   * Deletes a FHIR resource by its ID.
   * @param {string} id - The ID of the resource.
   * @returns {Promise<Result<void>>} - The result of the operation.
   */
  public async deleteResource(id: string): Promise<Result<T>> {
    return this.handleResult<T>(
      this.fhirClient.delete({
        resourceType: this.resourceTypeName,
        id: id,
      }) as Promise<T>
    );
  }

  /**
   * Determines the action to perform on a resource in a bundle.
   * @private
   * @param {any} objeto - The resource object.
   * @returns {"POST" | "PUT" | "DELETE" | "GET" | "PATCH"} - The action to perform.
   */
  private bundleAction(
    objeto: any
  ): "POST" | "PUT" | "DELETE" | "GET" | "PATCH" {
    // Verificar que "id" y "resourceType" tengan valores
    const idResourceTypeLlenos =
      objeto.id !== undefined && objeto.resourceType !== undefined;

    // Verificar que el resto de los atributos estén vacíos o indefinidos
    const restoAtributosVaciosOIndefinidos = Object.keys(objeto).every(
      (key) =>
        key === "id" ||
        key === "resourceType" ||
        objeto[key] === null ||
        objeto[key] === undefined ||
        objeto[key] === ""
    );

    // Devolver true si "id" y "resourceType" tienen valores y el resto está vacío o indefinido
    if (idResourceTypeLlenos && restoAtributosVaciosOIndefinidos)
      return "DELETE";
    else if (objeto.id) return "PUT";
    else return "POST";
  }

  /**
   * Generates the URL for a resource based on the method.
   * @private
   * @param {Resource} resource - The FHIR resource.
   * @param {"POST" | "PUT" | "DELETE" | "GET" | "PATCH"} method - The HTTP method.
   * @returns {string} - The resource URL.
   */
  private resourceUrl(
    resource: FhirResource,
    method: "POST" | "PUT" | "DELETE" | "GET" | "PATCH"
  ): string {
    return method === "POST"
      ? resource.resourceType
      : `${resource.resourceType}/${resource.id}`;
  }

  /**
   * Sends an array of resources as a bundle.
   * @param {T[]} newResources - The array of resources to send.
   * @returns {Promise<Result<T>>} - The result of the operation.
   */
  public async sendArray(newResources: T[]): Promise<Result<T>> {
    const result = await this.handleResult(
      this.fhirClient.transaction({
        body: {
          resourceType: "Bundle",
          type: "transaction",
          entry: newResources.map((resource) => {
            const method = this.bundleAction(resource); //TODO: verificar aquí para los casos de actualizar y eliminar
            const request = {
              method: method,
              url: this.resourceUrl(resource, method),
            };
            return { resource, request };
          }),
        },
      })
    );

    if (result.success) {
      return { success: true, data: {} as T };
    } else {
      return { success: false, error: result.error };
    }
  }

  /**
   * Updates an existing FHIR resource.
   * @param {T} newResource - The updated resource.
   * @returns {Promise<Result<T>>} - The result of the operation.
   */
  public async updateResource(newResource: T): Promise<Result<T>> {
    return this.handleResult<T>(
      this.fhirClient.update({
        resourceType: this.resourceTypeName,
        id: newResource.id,
        body: newResource,
      }) as Promise<T>
    );
  }

  /**
   * Sends a FHIR resource. If the resource has an ID, it updates the resource; otherwise, it creates a new resource.
   * @param {T} newResource - The resource to send.
   * @returns {Promise<Result<T>>} - The result of the operation.
   */
  public async sendResource(newResource: T): Promise<Result<T>> {
    return newResource.id
      ? this.updateResource(newResource)
      : this.postResource(newResource);
  }

  /**
   * Retrieves a list of FHIR resources.
   * @param {SearchParams} [params] - The search parameters.
   * @returns {Promise<Result<T[]>>} - The result of the operation.
   */
  public async getResources(params?: SearchParams): Promise<Result<T[]>> {
    const result = await this.handleResult<Bundle>(
      this.fhirClient.search({
        resourceType: this.resourceTypeName,
        searchParams: {
          _count: 5,
          ...params,
          _sort: "-_lastUpdated",
        },
      }) as Promise<Bundle>
    );

    if (result.success) {
      const response = result.data;
      this._resourceBundle = response;
      this.setNewPages(response);
      const resources =
        response.entry?.map((entry) => entry.resource as T) || [];
      return { success: true, data: resources };
    } else {
      return { success: false, error: result.error };
    }
  }

  private ensureHttpsInUrls = (bundle: any) => {
    if (!this.apiUrl.startsWith("https://")) return bundle;
    if (bundle && bundle.link) {
      bundle.link.forEach((link: any) => {
        if (link.url && link.url.startsWith("http://")) {
          link.url = link.url.replace("http://", "https://");
        }
      });
    }
    return bundle;
  };

  /**
   * Retrieves the next or previous page of resources.
   * @param {"next" | "prev"} direction - The direction of the page to retrieve.
   * @returns {Promise<Result<T[]>>} - The result of the operation.
   */
  public async getNewResources(
    direction: "next" | "prev"
  ): Promise<Result<T[]>> {
    console.log(this._resourceBundle);
    this._resourceBundle = this.ensureHttpsInUrls(this._resourceBundle);
    const response = await this.handleResult<Bundle>(
      direction === "next"
        ? (this.fhirClient.nextPage({
            bundle: this._resourceBundle,
          }) as Promise<Bundle>)
        : (this.fhirClient.prevPage({
            bundle: this._resourceBundle,
          }) as Promise<Bundle>)
    );

    console.log(response);
    if (!response.success) return response;

    this._resourceBundle = response.data;
    this.setNewPages(response.data);

    const resources =
      response.data.entry?.map((entry) => entry.resource as T) || [];
    return { success: true, data: resources };
  }

  /**
   * Parses the operation outcome to extract the error message.
   * @private
   * @param {OperationOutcome} operation - The operation outcome.
   * @returns {string} - The error message.
   */
  private parseOperationOutcome(
    operation: OperationOutcome | undefined
  ): string | undefined {
    if (!operation || !operation.issue || !operation.issue[0]) {
      return undefined;
    }
    return operation.issue[0].diagnostics || undefined;
  }

  /**
   * Retrieves the coding section of a CodeableConcept by system.
   * @param {CodeableConcept} code - The CodeableConcept.
   * @param {string} system - The coding system.
   * @returns {CodeableConcept | null} - The coding section or null if not found.
   */
  public getCodingBySystem(code: CodeableConcept, system: string) {
    const coding = code.coding;
    if (!coding || coding.length === 0) return null;
    const section = coding.find((e) => e.system === system) || null;
    return section;
  }
}
