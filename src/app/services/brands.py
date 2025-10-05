"""Brand related services."""

from __future__ import annotations

from typing import Any, Dict, Iterable, Mapping, MutableMapping, Optional
from uuid import UUID

from fastapi import HTTPException, status
from fastapi.templating import Jinja2Templates
from starlette.requests import Request
from starlette.responses import TemplateResponse


class BrandRepositoryProtocol:
    """Protocol describing the repository used by :class:`BrandService`."""

    async def get_by_slug(self, slug: str) -> Mapping[str, Any]:  # pragma: no cover - runtime dependency
        raise NotImplementedError

    async def add_pending_co_owner(
        self, brand_id: UUID | str, profile: Mapping[str, Any], *, note: Optional[str]
    ) -> Mapping[str, Any]:  # pragma: no cover - runtime dependency
        raise NotImplementedError

    async def approve_co_owner(
        self, brand_id: UUID | str, profile_id: UUID | str
    ) -> Mapping[str, Any]:  # pragma: no cover - runtime dependency
        raise NotImplementedError

    async def remove_pending_co_owner(
        self, brand_id: UUID | str, profile_id: UUID | str
    ) -> None:  # pragma: no cover - runtime dependency
        raise NotImplementedError


class ProfileServiceProtocol:
    """Protocol describing the profile lookup service."""

    async def get_by_username(self, username: str) -> Mapping[str, Any]:  # pragma: no cover - runtime dependency
        raise NotImplementedError


class BrandService:
    """Application service for brand related operations."""

    def __init__(
        self,
        brand_repository: BrandRepositoryProtocol,
        profile_service: ProfileServiceProtocol,
        templates: Jinja2Templates,
    ) -> None:
        self._brand_repository = brand_repository
        self._profile_service = profile_service
        self._templates = templates

    async def invite_co_owner(
        self, request: Request, slug: str, *, username: str, note: Optional[str]
    ) -> TemplateResponse:
        brand = await self._get_brand_or_404(slug)
        profile = await self._profile_service.get_by_username(username)
        await self._brand_repository.add_pending_co_owner(brand["id"], profile, note=note)
        updated_brand = await self._brand_repository.get_by_slug(slug)
        return self.render_team_partial(request, updated_brand, message="Undangan co-owner telah dikirim.")

    async def approve_co_owner(
        self, request: Request, slug: str, profile_id: UUID | str
    ) -> TemplateResponse:
        brand = await self._get_brand_or_404(slug)
        await self._brand_repository.approve_co_owner(brand["id"], profile_id)
        updated_brand = await self._brand_repository.get_by_slug(slug)
        return self.render_team_partial(request, updated_brand, message="Co-owner disetujui.")

    async def cancel_co_owner_invite(
        self, request: Request, slug: str, profile_id: UUID | str
    ) -> TemplateResponse:
        """Cancel a pending co-owner invitation.

        Parameters
        ----------
        request:
            The current request instance, used for rendering HTMX partial responses.
        slug:
            Brand slug used to identify the brand.
        profile_id:
            Identifier of the profile being removed from the pending list.
        """

        brand = await self._get_brand_or_404(slug)
        pending = _extract_pending_ids(brand.get("pending_co_owners", ()))
        if str(profile_id) not in pending:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Undangan tidak ditemukan")

        await self._brand_repository.remove_pending_co_owner(brand["id"], profile_id)
        updated_brand = await self._brand_repository.get_by_slug(slug)
        return self.render_team_partial(request, updated_brand, message="Undangan co-owner dibatalkan.")

    async def _get_brand_or_404(self, slug: str) -> Mapping[str, Any]:
        brand = await self._brand_repository.get_by_slug(slug)
        if not brand:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Brand tidak ditemukan")
        return brand

    def team_partial_context(self, brand: Mapping[str, Any], *, message: Optional[str] = None) -> Dict[str, Any]:
        """Expose a helper that prepares the context for the co-owner team partial."""

        context: Dict[str, Any] = {
            "brand": brand,
            "co_owners": list(brand.get("co_owners", ())),
            "pending_co_owners": list(brand.get("pending_co_owners", ())),
        }
        if message:
            context["message"] = message
        return context

    def render_team_partial(
        self, request: Request, brand: Mapping[str, Any], *, message: Optional[str] = None
    ) -> TemplateResponse:
        context = self.team_partial_context(brand, message=message)
        context["request"] = request
        return self._templates.TemplateResponse("pages/brand/partials/pending_co_owners.html", context)


def _extract_pending_ids(pending_members: Iterable[MutableMapping[str, Any]] | None) -> set[str]:
    if not pending_members:
        return set()
    ids: set[str] = set()
    for member in pending_members:
        profile_id = member.get("profile_id")
        if profile_id is None:
            continue
        ids.add(str(profile_id))
    return ids
