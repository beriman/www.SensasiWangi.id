from __future__ import annotations

from fastapi import APIRouter, Depends, Form, HTTPException, Request
from fastapi.templating import Jinja2Templates

from ...services import Brand, BrandRepository, BrandService, Profile


class ProfileService:
    """Very small profile lookup service used by the demo routes."""

    def __init__(self) -> None:
        self._profiles = {
            "owner": Profile(id="profile-1", username="owner", display_name="Owner"),
            "co_owner": Profile(id="profile-2", username="co_owner", display_name="Co Owner"),
        }

    def get_by_username(self, username: str) -> Profile:
        profile = self._profiles.get(username)
        if not profile:
            raise HTTPException(status_code=404, detail="Profil tidak ditemukan")
        return profile

    def get_by_id(self, profile_id: str) -> Profile:
        for profile in self._profiles.values():
            if profile.id == profile_id:
                return profile
        raise HTTPException(status_code=404, detail="Profil tidak ditemukan")


templates = Jinja2Templates(directory="src/app/templates")
repository = BrandRepository()
repository.seed(
    [
        Brand(id="brand-1", name="Sensasi Wangi", slug="sensasi-wangi"),
    ]
)
brand_service = BrandService(repository, templates)
profile_service = ProfileService()

router = APIRouter(prefix="/brands", tags=["brands"])


def get_brand_service() -> BrandService:
    return brand_service


def get_profile_service() -> ProfileService:
    return profile_service


@router.post("/{slug}/co-owners")
async def invite_co_owner(
    slug: str,
    request: Request,
    username: str = Form(...),
    note: str | None = Form(None),
    service: BrandService = Depends(get_brand_service),
    profiles: ProfileService = Depends(get_profile_service),
):
    brand = service.get_brand_or_404(slug)
    profile = profiles.get_by_username(username)
    service.invite_co_owner(brand, profile, note=note)
    return service.render_pending_team_partial(request, brand, message="Undangan co-owner dikirim")


@router.post("/{slug}/co-owners/{profile_id}/approve")
async def approve_co_owner(
    slug: str,
    profile_id: str,
    request: Request,
    service: BrandService = Depends(get_brand_service),
):
    brand = service.get_brand_or_404(slug)
    service.approve_co_owner_invite(brand, profile_id)
    return service.render_pending_team_partial(request, brand, message="Undangan disetujui")


@router.delete("/{slug}/co-owners/{profile_id}")
async def cancel_co_owner_invite(
    slug: str,
    profile_id: str,
    request: Request,
    service: BrandService = Depends(get_brand_service),
):
    brand = service.get_brand_or_404(slug)
    service.cancel_co_owner_invite(brand, profile_id)
    return service.render_pending_team_partial(request, brand, message="Undangan dibatalkan")
