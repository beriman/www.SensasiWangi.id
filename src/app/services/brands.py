from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, Iterable, List, Optional

from fastapi import HTTPException
from fastapi.templating import Jinja2Templates
from starlette.requests import Request
from starlette.responses import TemplateResponse


@dataclass
class Profile:
    """Simple representation of a user profile."""

    id: str
    username: str
    display_name: Optional[str] = None


@dataclass
class TeamMember:
    """A brand team member, either pending or approved."""

    profile_id: str
    username: str
    display_name: Optional[str] = None
    note: Optional[str] = None
    status: str = "pending"

    @property
    def is_pending(self) -> bool:
        return self.status == "pending"

    @property
    def is_active(self) -> bool:
        return self.status == "approved"


@dataclass
class Brand:
    id: str
    name: str
    slug: str
    team: List[TeamMember] = field(default_factory=list)

    @property
    def pending_members(self) -> List[TeamMember]:
        return [member for member in self.team if member.is_pending]

    @property
    def active_members(self) -> List[TeamMember]:
        return [member for member in self.team if member.is_active]


class BrandRepository:
    """Very small in-memory repository used for demonstration purposes."""

    def __init__(self) -> None:
        self._brands: Dict[str, Brand] = {}

    def get_by_slug(self, slug: str) -> Optional[Brand]:
        return self._brands.get(slug)

    def save(self, brand: Brand) -> None:
        self._brands[brand.slug] = brand

    def upsert(self, brand: Brand) -> Brand:
        self.save(brand)
        return brand

    def seed(self, brands: Iterable[Brand]) -> None:
        for brand in brands:
            self.save(brand)


class BrandService:
    """Business logic that manages brand co-owner invitations."""

    def __init__(self, repository: BrandRepository, templates: Jinja2Templates) -> None:
        self._repository = repository
        self._templates = templates

    def get_brand_or_404(self, slug: str) -> Brand:
        brand = self._repository.get_by_slug(slug)
        if not brand:
            raise HTTPException(status_code=404, detail="Brand tidak ditemukan")
        return brand

    def invite_co_owner(self, brand: Brand, profile: Profile, *, note: Optional[str] = None) -> TeamMember:
        """Add a profile as a pending co-owner for the given brand."""

        if any(member.profile_id == profile.id for member in brand.team):
            raise HTTPException(status_code=400, detail="Profil sudah menjadi bagian dari tim")

        new_member = TeamMember(
            profile_id=profile.id,
            username=profile.username,
            display_name=profile.display_name,
            note=note,
            status="pending",
        )
        brand.team.append(new_member)
        self._repository.save(brand)
        return new_member

    def approve_co_owner_invite(self, brand: Brand, profile_id: str) -> TeamMember:
        for member in brand.pending_members:
            if member.profile_id == profile_id:
                member.status = "approved"
                self._repository.save(brand)
                return member
        raise HTTPException(status_code=404, detail="Undangan co-owner tidak ditemukan")

    def cancel_co_owner_invite(self, brand: Brand, profile_id: str) -> None:
        """Remove a pending co-owner from the brand."""

        pending_before = len(brand.pending_members)
        brand.team = [member for member in brand.team if not (member.profile_id == profile_id and member.is_pending)]
        if len(brand.pending_members) == pending_before:
            raise HTTPException(status_code=404, detail="Undangan co-owner tidak ditemukan")
        self._repository.save(brand)

    def render_pending_team_partial(
        self, request: Request, brand: Brand, *, message: Optional[str] = None
    ) -> TemplateResponse:
        """Expose the formatted pending team section as a partial template."""

        context = {
            "request": request,
            "brand": brand,
            "pending_members": brand.pending_members,
            "message": message,
        }
        return self._templates.TemplateResponse("partials/brand/pending_co_owners.html", context)
